import logging
import uvicorn
import os
import aiohttp
import asyncio
import json
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Request, WebSocket, WebSocketDisconnect, Depends
from twilio.rest import Client
from helpers.twilio import twilio_stream
from helpers.voice_system_prompt import SYSTEM_MESSAGE
from services.openai_functions import welcome_message, send_session_update, generate_audio_response
from tools.execute_tool import execute_tool
from fastapi.responses import JSONResponse


# Load environment variables from a .env file
load_dotenv()

# Get the PORT value from environment variables, defaulting to 5000 if not found
PORT = int(os.getenv("PORT", 5050))

app = FastAPI()

router = APIRouter()

# Environment variables
VOICE = os.getenv("VOICE")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
PHONE_NUMBER_FROM = os.getenv("PHONE_NUMBER_FROM")
PHONE_NUMBER_TO = os.getenv("PHONE_NUMBER_TO")

DOMAIN = os.getenv('DOMAIN', '')


# Initialize Twilio client
client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

@app.get('/', response_class=JSONResponse)
async def index_page():
    return {"message": "Twilio Media Stream Server is running!"}

@app.websocket("/stream/websocket")
async def handle_media_stream(websocket: WebSocket):
    logging.info("Stream WebSocket connection established.")
    await websocket.accept()

    try:
        async with aiohttp.ClientSession() as session:
            async with session.ws_connect(
                'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "OpenAI-Beta": "realtime=v1"
                }
            ) as openai_ws:
                logging.info("OpenAI WebSocket connection established.")
                await initialize_session(openai_ws)
                
                stream_sid = None
                async def receive_from_twilio():
                    nonlocal stream_sid
                    try:
                        async for message in websocket.iter_text():
                            logging.info(f"Received message: {message}")
                            data = json.loads(message)
                            if data['event'] == 'media' and not openai_ws.closed:
                                audio_append = {
                                    "type": "input_audio_buffer.append",
                                    "audio": data['media']['payload']
                                }
                                await openai_ws.send_json(audio_append)
                            elif data['event'] == 'start':
                                stream_sid = data['start']['streamSid']
                                logging.info(f"Incoming stream has started {stream_sid}")

                    except WebSocketDisconnect:
                        logging.info("Client disconnected.")

                        if not openai_ws.closed:
                            await openai_ws.close()

                async def send_to_twilio():
                    nonlocal stream_sid
                    try:
                        async for openai_message in openai_ws:
                            response = json.loads(openai_message.data)
                            logging.info(f"Received OpenAI message: {response['type']}")

                            if response['type'] == 'session.created':
                                logging.info(f"Session created for stream: {stream_sid}")
                                await send_session_update(openai_ws, VOICE, SYSTEM_MESSAGE)

                            if response['type'] == 'session.updated': 
                                logging.info(f"Session updated: {stream_sid}: {response}")                       
                                await welcome_message(openai_ws)

                            if response['type'] == 'response.function_call_arguments.done':
                                logging.debug(f"Function call arguments: {stream_sid}: {response}")
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
    except Exception as e:
        logging.error(f"Error in WebSocket connection: {e} - {traceback.format_exc()}")
        await websocket.close(code=1006)  # Close the WebSocket connection if an error occurs



async def send_initial_conversation_item(openai_ws):
    """Send initial conversation so AI talks first."""
    initial_conversation_item = {
        "type": "conversation.item.create",
        "item": {
            "type": "message",
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": (
                        "Hello! This is Smart line calling on behalf of Electroplanet. "
                        "We are reaching out to inform you about our latest offerings and how they "
                        "can benefit you. How can I assist you today?"
                    )
                }
            ]
        }
    }
    await openai_ws.send(json.dumps(initial_conversation_item))
    await openai_ws.send(json.dumps({"type": "response.create"}))

async def initialize_session(openai_ws):
    """Control initial session with OpenAI."""
    session_update = {
        "type": "session.update",
        "session": {
            "turn_detection": {"type": "server_vad"},
            "input_audio_format": "g711_ulaw",
            "output_audio_format": "g711_ulaw",
            "voice": VOICE,
            "instructions": SYSTEM_MESSAGE,
            "modalities": ["text", "audio"],
            "temperature": 0.8,
        }
    }
    print('Sending session update:', json.dumps(session_update))
    await openai_ws.send(json.dumps(session_update))

    # Have the AI speak first
    await send_initial_conversation_item(openai_ws)
    

async def check_number_allowed(to):
    """Check if a number is allowed to be called."""
    try:
        incoming_numbers = client.incoming_phone_numbers.list(phone_number=to)
        if incoming_numbers:
            return True

        outgoing_caller_ids = client.outgoing_caller_ids.list(phone_number=to)
        if outgoing_caller_ids:
            return True

        return False
    except Exception as e:
        print(f"Error checking phone number: {e}")
        return False

async def make_call(phone_number_to_call: str):
    """Make an outbound call."""
    if not phone_number_to_call:
        raise ValueError("Please provide a phone number to call.")

    is_allowed = await check_number_allowed(phone_number_to_call)
    if not is_allowed:
        raise ValueError(f"The number {phone_number_to_call} is not recognized as a valid outgoing number or caller ID.")

    outbound_twiml = (
        f"""
        <?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Connect>
                <Stream url="wss://{DOMAIN}/stream/websocket" />
            </Connect>
        </Response>
        """
        )

    call = client.calls.create(
        from_=PHONE_NUMBER_FROM,
        to=phone_number_to_call,
        twiml=outbound_twiml
        )

    await log_call_sid(call.sid)

async def log_call_sid(call_sid):
    """Log the call SID."""
    print(f"Call started with SID: {call_sid}")



app.include_router(router)



@app.on_event("startup")
async def startup_event():
    try:
        # Try making the call on startup
        await make_call(PHONE_NUMBER_TO)
    except Exception as e:
        logging.error(f"Error during startup: {e}")

if __name__ == "__main__":


    #loop = asyncio.get_event_loop()
    #loop.run_until_complete(make_call(PHONE_NUMBER_TO))

    uvicorn.run(app, host="127.0.0.1", port=PORT)
