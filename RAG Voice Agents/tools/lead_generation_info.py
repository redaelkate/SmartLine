from langchain.llms import OpenAI
from langchain_openai import ChatOpenAI

from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv
import gspread
from oauth2client.service_account import ServiceAccountCredentials

load_dotenv()

llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18", temperature=0)


extract_prompt = PromptTemplate(
    input_variables=["conversation"],
    template="""You are an AI specialized in extracting names and phone numbers from text. 
    Carefully analyze the following conversation and provide the customer's name and phone number in the format: 
    'Name: <name>, Phone: <phone>'.
    
    Conversation:
    {conversation}
    """
)

# Conversation Summarizer
summarize_prompt = PromptTemplate(
    input_variables=["conversation"],
    template="""You are an AI specialized in summarizing conversations. 
    Provide a concise yet thorough summary of the following conversation,
    focusing on key details, the customer's intent, and important requests.

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
"""
)


extract_chain = LLMChain(llm=llm, prompt=extract_prompt)

summarize_chain = LLMChain(llm=llm, prompt=summarize_prompt)

evaluate_chain = LLMChain(llm=llm, prompt=evaluate_prompt)

def process_lead_conversation(conversation):

    name_phone = extract_chain.run(conversation)
    
    summary = summarize_chain.run(conversation)
    
    lead_score = evaluate_chain.run(conversation)

    try:
        lead_score = float(lead_score)
    except ValueError:
        lead_score = 0.0

    lead_score=min(max(lead_score, 0), 5) 
    
    if 'Name:' in name_phone and 'Phone:' in name_phone:
        name = name_phone.split("Name: ")[1].split(", Phone: ")[0]
        phone = name_phone.split("Phone: ")[1]
    else:
        name = ""
        phone = ""
    lead_info={
        "name": name,
        "phone": phone,
        "summary": summary,
        "lead_score": lead_score
    }


    upload_row_to_google_sheet(lead_info["name"], lead_info["phone"],lead_info.get("time","unknown"),lead_info.get("time duration","unknown"), lead_info["summary"], lead_info["lead_score"])

    
    return lead_info



def upload_row_to_google_sheet(name, phone, summary, lead_score):
    scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]

    creds = ServiceAccountCredentials.from_json_keyfile_name(r'C:\Users\MOUAD\Desktop\projects\AI call center\RAG Voice Agents\RAG Voice Agents\credentialsH.json', scope)

    client = gspread.authorize(creds)

    sheet = client.open_by_url('https://docs.google.com/spreadsheets/d/1KYMO1sZTjbrtIvtBjEpKwA5k20zMHkEoYft_Z9NYMJM/edit?usp=sharing')

    worksheet = sheet.get_worksheet(0)

    worksheet.append_row([name, phone, summary, lead_score])




conversation = """
Customer: Hi, my name is John Doe. I'm interested in your product.
Agent: Great! Can I have your phone number?
Customer: Sure, it's 123-456-7890.
Agent: What are you looking for in our product?
Customer: I need something affordable and reliable.
"""

