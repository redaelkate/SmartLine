
import os
from fastapi.responses import Response
from dotenv import load_dotenv

load_dotenv()

WEBSOCKET_URL = os.getenv("WEBSOCKET_URL")

def twilio_stream():
    response = f"""
    <Response> 
        <Connect>
            <Stream url="wss://{WEBSOCKET_URL}/stream/websocket" />
        </Connect>
    </Response>
    """
    return Response(content=response, media_type="application/xml")