from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

# Marjane Mall Catalogue
catalogue = """
Marjane Mall Catalogue 

1. Electronics

Smartphones

Samsung Galaxy S23 - 256GB - 10,999 MAD

iPhone 14 Pro - 128GB - 14,999 MAD

Xiaomi Redmi Note 12 - 128GB - 3,799 MAD


Laptops

HP Pavilion 15 - Intel i5 - 8GB RAM - 7,499 MAD

MacBook Air M2 - 256GB SSD - 12,499 MAD



---

2. Clothing & Accessories

Men’s Fashion

Leather Jacket - 899 MAD

Casual Sneakers - 499 MAD


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

# Tool definition
check_catalogue_tool_definition = {
    "type": "function",
    "name": "check_catalogue",
    "description": (
        "Allows the user to search the Marjane Mall Catalogue for items matching the query. "
        "It returns the item name, details, and price for all matching items."
        "example_query : Find all laptops available, give me smartphones under 11,000 MAD.",

    ),
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The user's query for searching the catalogue."
            }
        },
        "required": ["query"]
    }
}

async def check_catalogue_tool(parameters):
    query = parameters.get('query')
    try:
        result = check_catalogue_chain.invoke(input={"query": query, "catalogue": catalogue}).content
        return {"result": result}
    except Exception as e:
        return {"result": f"Error occurred: {e}"}

# Example Usage
user_query = "give me smartphones under 11,000 MAD."
response = await check_catalogue_tool({"query": user_query})
print(response)
