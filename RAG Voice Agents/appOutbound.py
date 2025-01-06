import logging
import uvicorn
import os
import aiohttp
import asyncio
import json
import traceback
from dotenv import load_dotenv
from fastapi import FastAPI, APIRouter, Request, WebSocket, WebSocketDisconnect
from twilio.rest import Client
from helpers.voice_system_prompt import SYSTEM_MESSAGE
from services.openai_functions import welcome_message, send_session_update, generate_audio_response
from tools.execute_tool import execute_tool
import argparse


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


TWILIO_PHONE_NUMBER = os.getenv("PHONE_NUMBER_FROM")

# Initialize Twilio client
twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

async def make_call(phone_number: str):
    """
    Initiate an outbound call using Twilio.
    """
    try:
        # TwiML to connect the call to the WebSocket endpoint
        twiml = f"""
        <Response>
            <Connect>
                <Stream url="wss://{os.getenv('DOMAIN')}/stream/websocket" />
            </Connect>
        </Response>
        """

        # Make the outbound call
        call = twilio_client.calls.create(
            twiml=twiml,
            to=phone_number,
            from_=TWILIO_PHONE_NUMBER
        )

        logging.info(f"Outbound call initiated to {phone_number}. Call SID: {call.sid}")
    except Exception as e:
        logging.error(f"Failed to make outbound call: {e}")
        raise



@router.websocket("/stream/websocket")
async def handle_media_stream(websocket: WebSocket):
    """
    Handle WebSocket connections for outbound call media streams.
    """
    logging.info("WebSocket connection established for outbound call.")
    await websocket.accept()

    async with aiohttp.ClientSession() as session:
        async with session.ws_connect(
            'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "OpenAI-Beta": "realtime=v1"
            }
        ) as openai_ws:
            #await initialize_session(openai_ws)

            stream_sid = None

            async def receive_from_twilio():
                """
                Receive audio data from Twilio and send it to OpenAI.
                """
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
                            logging.info(f"Outbound call stream started. Stream SID: {stream_sid}")
                except WebSocketDisconnect:
                    if not openai_ws.closed:
                        await openai_ws.close()

            async def send_to_twilio():
                """
                Send OpenAI responses back to Twilio as audio.
                """
                nonlocal stream_sid
                try:
                    async for openai_message in openai_ws:
                        response = json.loads(openai_message.data)

                        if response['type'] == 'session.created':
                            logging.info(f"OpenAI WSS connection established. Stream SID: {stream_sid}")
                            await send_session_update(openai_ws, VOICE, SYSTEM_MESSAGE["outbound"])

                        if response['type'] == 'session.updated':
                            logging.info(f"OpenAI WSS connection updated. Stream SID: {stream_sid}: {response}")
                            await welcome_message(openai_ws)

                        if response['type'] == 'response.function_call_arguments.done':
                            logging.debug(f"Function call arguments received. Stream SID: {stream_sid}: {response}")
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
                    logging.error(f"Error in send_to_twilio: Stream SID: {stream_sid} {e} - {traceback.format_exc()}")

            await asyncio.gather(receive_from_twilio(), send_to_twilio())




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
    await openai_ws.send_json(initial_conversation_item)
    await openai_ws.send_json({"type": "response.create"})

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
    await openai_ws.send_json(session_update)

    # Have the AI speak first
    await send_initial_conversation_item(openai_ws)

app.include_router(router)

if __name__ == "__main__": # python appOutbound.py --call=+18005551212
    parser = argparse.ArgumentParser(description="Run the Twilio AI voice assistant server.")
    parser.add_argument('--call', default=os.getenv("PHONE_NUMBER_TO"), help="The phone number to call, e.g., '--call=+18005551212'")
    args = parser.parse_args()

    phone_number = args.call
    print(
        'Our recommendation is to always disclose the use of AI for outbound or inbound calls.\n'
        'Reminder: All of the rules of TCPA apply even if a call is made by AI.\n'
        'Check with your counsel for legal and compliance advice.'
    )

    loop = asyncio.get_event_loop()
    loop.run_until_complete(make_call(phone_number))

    uvicorn.run(app, host="127.0.0.1", port=PORT)

        