import logging
from tools.check_shipping_status_tool import check_shipping_status_tool_definition
from tools.check_stock_tool import check_stock_tool_definition
from tools.search_product_tool import search_product_tool_definition
from tools.process_order_tool import process_order_tool_definition

async def welcome_message(openai_ws):
    welcome_message = {
        "type": "conversation.item.create",
        "item": {
            "type": "message",
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Hello!"
                }
            ]
        }
    }
    await openai_ws.send_json(welcome_message)
    response_create = {
        "type": "response.create"
    }
    await openai_ws.send_json(response_create)

async def send_session_update(openai_ws, voice, system_message):
    session_update = {
        "type": "session.update",
        "session": {
            "turn_detection": {"type": "server_vad"},
            "input_audio_format": "g711_ulaw",
            "output_audio_format": "g711_ulaw",
            "voice": voice,
            "instructions": system_message,
            "modalities": ["text", "audio"],
            "temperature": 0.8,
            "tool_choice": "auto",
            "tools": [check_shipping_status_tool_definition, check_stock_tool_definition, search_product_tool_definition, process_order_tool_definition]
        }
    }
    await openai_ws.send_json(session_update)

async def generate_audio_response(stream_sid, openai_ws, response_text):
    response_message = {
        "type": "conversation.item.create",
        "item": {
            "type": "function_call_output",
            "call_id": stream_sid,
            "output": response_text            
        }
    }
    await openai_ws.send_json(response_message)
    
    instructions = f"""
    Respond to the user's question based on this information:
    === 
    {response_text}. 
    ===
    Be concise and friendly.
    """
    logging.info(f"Generate audio response {stream_sid}: {instructions}")

    response_create = {
        "type": "response.create",
        "response": {
            "modalities": ["text", "audio"],
            "instructions": instructions
        }
    }
    await openai_ws.send_json(response_create)


