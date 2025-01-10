from langchain_openai import ChatOpenAI

from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv
import gspread
from oauth2client.service_account import ServiceAccountCredentials

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18", temperature=0)



# Conversation Summarizer
summarize_prompt = PromptTemplate(
    input_variables=["conversation"],
    template="""Summarize the following conversation in one sentence, focusing on the main key points discussed.

Conversation:
{conversation}
"""
)

# Lead Evaluator
evaluate_prompt = PromptTemplate(
    input_variables=["conversation"],
    template="""You are an AI specialized in evaluating leads.
Analyze the following conversation and provide a lead evaluation score between 1 and 5 based on the customer's interest and intent.
The output is an integer between 1 and 5.

Conversation:
{conversation}

lead score (an Integer between 1 and 5):
"""
)



summarize_chain =summarize_prompt | llm

evaluate_chain = evaluate_prompt | llm


def structure_conversation(conversation):
    """
    Formats the conversation into a structured string for the hangup agent.
    
    Args:
        conversation (list): A list of dictionaries containing 'role' and 'message' keys.
    
    Returns:
        str: A structured string representation of the conversation.
    """

    
    structured_conversation = []
    
    for turn in conversation:
        role = turn['role'].capitalize()  
        message = turn['message'].strip()  
        structured_conversation.append(f"{role}: {message}")
    
    return "\n".join(structured_conversation)


def upload_row_to_google_sheet(name, phone, time, time_duration, summary, lead_score):
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]

    creds = ServiceAccountCredentials.from_json_keyfile_name(r'C:\Users\MOUAD\Desktop\projects\AI call center\RAG Voice Agents\RAG Voice Agents\credentialsH.json', scope)

    client = gspread.authorize(creds)

    sheet = client.open_by_url('https://docs.google.com/spreadsheets/d/1KYMO1sZTjbrtIvtBjEpKwA5k20zMHkEoYft_Z9NYMJM/edit?usp=sharing')

    worksheet = sheet.get_worksheet(0)

    worksheet.append_row([name, phone, time, time_duration, summary, lead_score])


def process_lead_conversation(conversation, name, phone):
    structured_conversation = structure_conversation(conversation)

    
    summary = summarize_chain.invoke(structured_conversation).content
    
    lead_score = evaluate_chain.invoke(structured_conversation).content

    try:
        lead_score = float(lead_score)

        
    except ValueError:
        lead_score = 0.0

    except Exception as e:
        lead_score = 0.0
        print(f"Error: {e}")


    lead_score = min(max(lead_score, 0), 5) 
    

    lead_info = {
        "name": name,
        "phone": phone,
        "time": "unknown",
        "time_duration": "unknown",
        "summary": summary,
        "lead_score": lead_score

    }
    try:
        upload_row_to_google_sheet(lead_info["name"], lead_info["phone"], lead_info["time"], lead_info["time_duration"], lead_info["summary"], lead_info["lead_score"])
    except Exception as e:
        print(f"Error uploading to Google Sheets: {e}")

    return lead_info

#conversation = [
#    {"role": "customer", "message": "Hi, my name is John Doe. I'm interested in your product."},
#    {"role": "agent", "message": "Great! Can I have your phone number?"},
#    {"role": "customer", "message": "Sure, it's 123-456-7890."},
#    {"role": "agent", "message": "What are you looking for in our product?"},
#    {"role": "customer", "message": "I need something affordable and reliable."},
#    {"role": "agent", "message": "we have everything you need"},
#    {"role": "customer", "message": "thank you im interested"}
#]


#upload_row_to_google_sheet("maouad", "028", "34", "time_duration", "summary", "lead_score")
#result=process_lead_conversation(conversation,phone="11",name="mouad")
#print(result)
