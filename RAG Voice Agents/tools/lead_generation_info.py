from langchain.llms import OpenAI
from langchain_openai import ChatOpenAI

from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os

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

def process_conversation(conversation):

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
    
    return {
        "name": name,
        "phone": phone,
        "summary": summary,
        "lead_score": lead_score
    }




conversation = """
Customer: Hi, my name is John Doe. I'm interested in your product.
Agent: Great! Can I have your phone number?
Customer: Sure, it's 123-456-7890.
Agent: What are you looking for in our product?
Customer: I need something affordable and reliable.
"""

result = process_conversation(conversation)
print(result)