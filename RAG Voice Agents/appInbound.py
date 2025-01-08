import logging
import uvicorn
import os
import aiohttp
import asyncio
import json
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from helpers.twilio import twilio_stream
from helpers.voice_system_prompt import SYSTEM_MESSAGE
from services.openai_functions import welcome_message, send_session_update, generate_audio_response
from tools.execute_tool import execute_tool
from twilio.twiml.voice_response import VoiceResponse
from fastapi.responses import Response
from twilio.rest import Client
from services.openai_functions import should_hangup
from ConnectionClosed import ConnectionClosedHandler, execute_on_connection_closed




app = FastAPI()
load_dotenv()

PORT = int(os.getenv("PORT", 5050))


VOICE = os.getenv("VOICE")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DOMAIN = os.getenv("DOMAIN")   

call_sid=None
transcript = []











# Set up the logger with the custom handler
logger = logging.getLogger()
logger.setLevel(logging.INFO)


# Create a formatter
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Add the custom handler to the logger
handler = ConnectionClosedHandler(execute_on_connection_closed, transcript)
handler.setFormatter(formatter)
logger.addHandler(handler)

##########
# Configure Uvicorn to use the same logger
uvicorn_logger = logging.getLogger("uvicorn")
uvicorn_logger.setLevel(logging.INFO)
uvicorn_logger.addHandler(handler)







@app.api_route("/stream/incoming-call", methods=["GET", "POST"])
async def handle_incoming_call(request: Request):
    global call_sid
    logging.info("Stream Incoming call received.")

    data = await request.form()
    call_sid = data.get('CallSid')
    
    if call_sid:
        logging.info(f"Received Call SID: {call_sid}")
    else:
        logging.error("Call SID not found in the request.")

    return twilio_stream()





async def handle_hangup(transcript, stream_sid, openai_ws, call_sid):
    try:

        
        await generate_audio_response(stream_sid, openai_ws, "Goodbye, ending the call.")
        
        logging.info(f"Hang up on call: {stream_sid}")
        
        account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
        client = Client(account_sid, auth_token)
        call = client.calls(call_sid).update(status='completed')
        
        print(f"Call {call.sid} has been terminated.")
    except Exception as e:
        logging.error(f"Error during hangup process: {e}")

async def check_and_handle_hangup(transcript, stream_sid, openai_ws, call_sid):
    try:
        hangup = await should_hangup(str(transcript))
        if hangup:
            logging.info("Hangup detected. Waiting for 2 seconds before proceeding.")
            await asyncio.sleep(2)
            await handle_hangup(transcript, stream_sid, openai_ws, call_sid)
    except Exception as e:
        logging.error(f"Error in hangup check: {e}")

@app.websocket("/stream/websocket")
async def handle_media_stream(websocket: WebSocket):
    logging.info("Stream WebSocket connection established.")
    await websocket.accept()

    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(
            'wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17',
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "OpenAI-Beta": "realtime=v1"
            }
        ) as openai_ws:

            stream_sid = None
            latest_media_timestamp = 0
            response_start_timestamp_twilio = None
            current_item_id = None  
            mark_queue = []

            async def receive_from_twilio():
                nonlocal stream_sid, latest_media_timestamp
                try:
                    async for message in websocket.iter_text():
                        data = json.loads(message) #doesnt contains call sid

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


                except Exception as e:
                    logging.error(f"Error in receive_from_twilio: {e}")

            async def send_to_twilio():
                nonlocal stream_sid, current_item_id, response_start_timestamp_twilio, latest_media_timestamp
                try:
                    async for openai_message in openai_ws:

                        
                        response = json.loads(openai_message.data)

                        if response['type'] == 'session.created':
                            logging.info(f"OpenAI WSS connection established. => {stream_sid}")
                            await send_session_update(openai_ws, VOICE, SYSTEM_MESSAGE["inbound"])

                        if response['type'] == 'session.updated': 
                            logging.info(f"OpenAI WSS connection updated. => {stream_sid}: {response}")                       
                            await welcome_message(openai_ws)  

                        if response['type'] == 'response.done':
                            try:
                                # Try to access the transcript
                                mess = response["response"]["output"][0]["content"][0]["transcript"]
                                transcript.append({"role": "agent", "message": mess})  # Add agent transcript

                                await check_and_handle_hangup(transcript, stream_sid, openai_ws, call_sid)

                            except (KeyError, IndexError):
                                # Do nothing if the structure is invalid
                                pass
                                 
                        if response['type'] == 'conversation.item.input_audio_transcription.completed':
                            man = response["transcript"]
                            transcript.append({"role": "client", "message": man})  # Add client transcript
                            

                        if response['type'] == 'response.function_call_arguments.done':
                            logging.debug(f"Function call arguments received. => {stream_sid}: {response}")
                            result = await execute_tool(response)


                            await generate_audio_response(stream_sid, openai_ws, result['result'])

                        if response['type'] == 'response.audio.delta' and response.get('delta'):

                            try:
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
                            except RuntimeError as e:
                                if "Unexpected ASGI message 'websocket.send'" in str(e):
                                    logging.warning("WebSocket connection is closed. Cannot send audio delta.")
                                    break
                                else:
                                    raise e


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



if __name__ == "__main__":
    try:
        # Start the Uvicorn server with the FastAPI app, running on the specified port
        uvicorn.run(app, host="127.0.0.1", port=PORT,log_config=None)
    except Exception as error:
        # Log the error in case the server fails to start
        logging.error(f"Error: {error}")
        raise error
