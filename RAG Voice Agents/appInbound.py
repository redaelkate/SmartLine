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

            stream_sid = None

            async def receive_from_twilio():
                nonlocal stream_sid
                try:
                    async for message in websocket.iter_text():
                        data = json.loads(message)
                        if data['event'] == 'media' and not openai_ws.closed:
                            audio_append = {
                                "type": "input_audio_buffer.append",
                                "audio": data['media']['payload']
                            }
                            await openai_ws.send_json(audio_append)
                        elif data['event'] == 'start':
                            stream_sid = data['start']['streamSid']
                except WebSocketDisconnect:
                    if not openai_ws.closed:
                        await openai_ws.close()

            async def send_to_twilio():
                nonlocal stream_sid
                try:
                    async for openai_message in openai_ws:
                        response = json.loads(openai_message.data)

                        if response['type'] == 'session.created':
                            logging.info(f"OpenAI WSS connection established. => {stream_sid}")
                            await send_session_update(openai_ws, VOICE, SYSTEM_MESSAGE["inbound"])

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

                except Exception as e:
                    logging.error(f"Error in send_to_twilio: {stream_sid} {e} - {traceback.format_exc()}")

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