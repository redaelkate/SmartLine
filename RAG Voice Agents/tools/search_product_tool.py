from helpers.read_json_file import read_json_file

search_product_tool_definition = {
    "type": "function",
    "name": "search_product",
    "description": (
        "Allows the user to search for a product in the ecommerce store's catalog by name. "
        "It returns the product name and price if available, otherwise it indicates that the product is not found."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "product_name": {
                "type": "string",
                "description": "The name of the product the user is searching for."
            }
        },
        "required": ["product_name"]
    }
}

async def search_product_tool(parameters):
    product_name = parameters.get('product_name')
    products = await read_json_file('../dummy_db/products.json')
    
    for product in products:
        if product['name'].lower() == product_name.lower():
            return {"result": f"The product {product['name']} is available for {product['price']}$."}
    
    return {"result": f"The product {product_name} is not available."}
