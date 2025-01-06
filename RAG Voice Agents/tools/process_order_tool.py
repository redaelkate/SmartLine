from helpers.read_json_file import read_json_file

process_order_tool_definition = {
    "type": "function",
    "name": "process_order",
    "description": (
        "Allows the user to check the status of an order by providing the order ID. "
        "It returns the current status of the order, such as 'Processed', 'Pending', 'Shipped', or 'Delivered'."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "order_id": {
                "type": "string",
                "description": "The unique identifier (ID) of the order to check."
            }
        },
        "required": ["order_id"]
    }
}

async def process_order_tool(parameters):
    order_id = parameters.get('order_id')
    orders = await read_json_file('../dummy_db/orders.json')
    
    for order in orders:
        if order['order_id'] == order_id:
            return {"result": f"The order with ID {order_id} is {order['status']}."}
    
    return {"result": f"No order found with ID {order_id}."}
