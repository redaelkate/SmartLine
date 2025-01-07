import logging
import uvicorn
import os
import aiohttp
import asyncio
import json
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Request, WebSocket, WebSocketDisconnect
from helpers.twilio import twilio_stream
from helpers.voice_system_prompt import SYSTEM_MESSAGE
from services.openai_functions import welcome_message, send_session_update, generate_audio_response
from tools.execute_tool import execute_tool

# Load environment variables from a .env file
load_dotenv()

# Get the PORT value from environment variables, defaulting to 5000 if not found
PORT = int(os.getenv("PORT", 5050))

app = FastAPI()

router = APIRouter()

# Environment variables
VOICE = os.getenv("VOICE")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

@router.api_route("/stream/incoming-call", methods=["GET", "POST"])
async def handle_incoming_call(request: Request):
    logging.info("Stream Incoming call received.")
    return twilio_stream()

@router.websocket("/stream/websocket")
async def handle_media_stream(websocket: WebSocket):
    logging.info("Stream WebSocket connection established.")
    await websocket.accept()

    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(
            'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "OpenAI-Beta": "realtime=v1"
            }
        ) as openai_ws:

            # Define state variables in the enclosing scope
            stream_sid = None
            latest_media_timestamp = 0
            response_start_timestamp_twilio = None
            current_item_id = None  # Moved into the enclosing scope
            mark_queue = []

            async def receive_from_twilio():
                nonlocal stream_sid, latest_media_timestamp
                try:
                    async for message in websocket.iter_text():
                        data = json.loads(message)
                        if data['event'] == 'media' and not openai_ws.closed:
                            latest_media_timestamp = int(data['media']['timestamp'])
                            audio_append = {
                                "type": "input_audio_buffer.append",
                                "audio": data['media']['payload']
                            }
                            await openai_ws.send_json(audio_append)
                        elif data['event'] == 'start':
                            stream_sid = data['start']['streamSid']
                            logging.info(f"Incoming stream has started {stream_sid}")
                            response_start_timestamp_twilio = None
                            latest_media_timestamp = 0
                        elif data['event'] == 'mark':
                            if mark_queue:
                                mark_queue.pop(0)
                except WebSocketDisconnect:
                    logging.info("Client disconnected.")
                    if not openai_ws.closed:
                        await openai_ws.close()

            async def send_to_twilio():
                nonlocal stream_sid, current_item_id, response_start_timestamp_twilio, latest_media_timestamp
                try:
                    async for openai_message in openai_ws:
                        response = json.loads(openai_message.data)

                        if response['type'] == 'session.created':
                            logging.info(f"OpenAI WSS connection established. => {stream_sid}")
                            await send_session_update(openai_ws, VOICE, SYSTEM_MESSAGE)

                        if response['type'] == 'session.updated': 
                            logging.info(f"OpenAI WSS connection updated. => {stream_sid}: {response}")                       
                            await welcome_message(openai_ws)                            

                        if response['type'] == 'response.function_call_arguments.done':
                            logging.debug(f"Function call arguments received. => {stream_sid}: {response}")
                            result = await execute_tool(response)
                            await generate_audio_response(stream_sid, openai_ws, result['result'])

                        if response['type'] == 'response.audio.delta' and response.get('delta'):
                            audio_delta = {
                                "event": "media",
                                "streamSid": stream_sid,
                                "media": {
                                    "payload": response['delta']
                                }
                            }
                            await websocket.send_json(audio_delta)

                            if response_start_timestamp_twilio is None:
                                response_start_timestamp_twilio = latest_media_timestamp
                                logging.info(f"Setting start timestamp for new response: {response_start_timestamp_twilio}ms")

                            if response.get('item_id'):
                                current_item_id = response['item_id']

                            await send_mark(websocket, stream_sid)

                        # Handle interruptions when user starts speaking
                        if response.get('type') == 'input_audio_buffer.speech_started':
                            logging.info("User started speaking. Interrupting bot's response.")
                            await handle_interruption(openai_ws, stream_sid)

                except Exception as e:
                    logging.error(f"Error in send_to_twilio: {stream_sid} {e} - {traceback.format_exc()}")

            async def handle_interruption(openai_ws, stream_sid):
                """Handle interruption when the user starts speaking."""
                nonlocal current_item_id, response_start_timestamp_twilio, latest_media_timestamp
                if current_item_id and response_start_timestamp_twilio is not None:
                    elapsed_time = latest_media_timestamp - response_start_timestamp_twilio
                    logging.info(f"Calculating elapsed time for truncation: {latest_media_timestamp} - {response_start_timestamp_twilio} = {elapsed_time}ms")

                    truncate_event = {
                        "type": "conversation.item.truncate",
                        "item_id": current_item_id,
                        "content_index": 0,
                        "audio_end_ms": elapsed_time
                    }
                    await openai_ws.send_json(truncate_event)
                    logging.info(f"Truncating item with ID: {current_item_id}, Truncated at: {elapsed_time}ms")

                    await websocket.send_json({
                        "event": "clear",
                        "streamSid": stream_sid
                    })

                    mark_queue.clear()
                    current_item_id = None
                    response_start_timestamp_twilio = None

            async def send_mark(connection, stream_sid):
                """Send a mark event to Twilio."""
                if stream_sid:
                    mark_event = {
                        "event": "mark",
                        "streamSid": stream_sid,
                        "mark": {"name": "responsePart"}
                    }
                    await connection.send_json(mark_event)
                    mark_queue.append('responsePart')

            await asyncio.gather(receive_from_twilio(), send_to_twilio())

app.include_router(router)

if __name__ == "__main__":
    try:
        # Start the Uvicorn server with the FastAPI app, running on the specified port
        uvicorn.run(app, host="127.0.0.1", port=PORT)
    except Exception as error:
        # Log the error in case the server fails to start
        logging.error(f"Error: {error}")
        raise error
