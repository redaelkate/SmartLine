import logging
from tools.check_shipping_status_tool import check_shipping_status_tool_definition
from tools.check_stock_tool import check_stock_tool_definition
from tools.search_product_tool import search_product_tool_definition
from tools.process_order_tool import process_order_tool_definition
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from dotenv import load_dotenv
import asyncio
load_dotenv()
llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18", temperature=0)




hangup_prompt = PromptTemplate(
    input_variables=["conversation"],
    template="""You are an AI that decides if a call should end. Respond with 'true' to end the call, otherwise 'false'.

    ### Rules:
    1. **Gratitude with No Follow-Up**:
       - If the customer says "thank you", "thanks", "merci", "shukran", or similar, and from the previous messages shows he got what he want.
       - Example: 
         - Customer: "Thank you!"
         - Agent: "You're welcome!"
         - Decision: 'true'

    3. **Call Completion**:
       - End the call if the customer's request is fully addressed and no further help is needed.
       - Example:
         - Customer: "That's all I needed, thanks!"
         - Agent: "You're welcome!"
         - Decision: 'true'


    5. **Prolonged Silence**:
       - End the call if the customer does not respond for more than 10 seconds after your message.
       - Example:
         - Agent: "Is there anything else I can assist you with?"
         - Customer: no thank you
         - Decision: 'true'

    6. **Customer Confirms Completion**:
       - End the call if the customer explicitly states they have no further questions.
       - Example:
         - Customer: "I don't have any other questions."
         - Decision: 'true'
    7. if the agent asked a question offers help dont hangup

    ### Conversation:
    {conversation}

    ### Decision:
    Should the call be ended? Respond with 'true' or 'false'.
    """
)

hangup_chain =hangup_prompt | llm

import concurrent.futures

async def should_hangup(conversation):
    """
    Determines if the call should be ended based on the conversation.
    Returns True if the call should be hung up, otherwise False.
    """
    conversation = conversation[:-10]
    loop = asyncio.get_running_loop()
    try:
        result = await loop.run_in_executor(None, hangup_chain.invoke, conversation)
        decision = result.content.strip().lower()
        if decision not in ["true", "false"]:
            logging.warning(f"Unexpected decision from hangup agent: {decision}")
            return False  

        return decision == "true"
    except Exception as e:
        logging.error(f"Error in should_hangup: {e}")
        return False



summarize_prompt = PromptTemplate(
    input_variables=["conversation"],
    template="""You are an AI specialized in summarizing conversations. 
    Provide a concise yet thorough summary of the following conversation,
    focusing on key details, the customer's intent, and important requests.
    maximum 3 sentences.

    Conversation:
    {conversation}
    """
)
summarize_chain = summarize_prompt | llm


def generate_summary(conversation):
    return summarize_chain.invoke(conversation).content




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
            "input_audio_transcription": {"model": "whisper-1"},
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


