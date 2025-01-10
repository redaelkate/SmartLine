import logging
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from dotenv import load_dotenv
import asyncio
import concurrent.futures

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

############################################################################################################

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

############################################################################################################



from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI

# Marjane Mall Catalogue
catalogue = """
1. Electronics

Smartphones
Samsung Galaxy S23 - 256GB - 10,999 MAD
iPhone 14 Pro - 128GB - 14,999 MAD
Xiaomi Redmi Note 12 - 128GB - 3,799 MAD

Laptops
HP Pavilion 15 - Intel i5 - 8GB RAM - 7,499 MAD
MacBook Air M2 - 256GB SSD - 12,499 MAD

Televisions
LG Smart TV - 43” - 4K UHD - 4,999 MAD
Samsung QLED TV - 55” - 7,999 MAD

Accessories
Wireless Earbuds - JBL TUNE 230NC - 799 MAD
Power Bank - Anker 20,000mAh - 399 MAD

2. Home Appliances
...
(Full catalogue content here)
"""

# Prompt for querying the catalogue
check_catalogue_prompt = PromptTemplate(
    input_variables=["query", "catalogue"],
    template="""
You are an AI assistant that searches a product catalogue for relevant items based on the user's query.

Catalogue:
{catalogue}

### User Query:
{query}

### Instructions:
1. Search the catalogue for items matching the query. Be flexible with synonyms and partial matches.
2. Provide the item name, details, and price for all matching items.
3. If no matches are found, respond with "No matching items found."

### Response:
""",
)

# Initialize the LLM
llm = ChatOpenAI(model="gpt-4o-mini-2024-07-18", temperature=0)

# Create the chain
check_catalogue_chain = check_catalogue_prompt | llm


# Define the function
def check_catalogue(query):
    """
    Searches the Marjane Mall Catalogue for items matching the query and returns the results.
    """
    try:
        result = check_catalogue_chain.invoke(input={"query": query, "catalogue": catalogue}).content
        return result
    except Exception as e:
        return f"Error occurred: {e}"

# Example Usage
user_query = "Show me smartphones under 11,000 MAD."
response = check_catalogue(user_query)
print(response)
