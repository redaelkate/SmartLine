from helpers.read_json_file import read_json_file

check_shipping_status_tool_definition = {
    "type": "function",
    "name": "check_shipping_status",
    "description": (
        "Allows the user to check the shipping status of an order by providing a tracking number. "
        "It returns the current status of the shipment, such as 'In Transit', 'Delivered', or 'Out for Delivery'."
    ),
    "parameters": {
        "type": "object",
        "properties": {
            "tracking_number": {
                "type": "string",
                "description": "The tracking number for the shipment."
            }
        },
        "required": ["tracking_number"]
    }
}

async def check_shipping_status_tool(parameters):
    tracking_number = parameters.get('tracking_number')
    shipping_status = await read_json_file('../dummy_db/shipping_status.json')
    
    for shipment in shipping_status:
        if shipment['tracking_number'] == tracking_number:
            return {"result": f"The shipping status for tracking number {tracking_number} is '{shipment['status']}'."}
    
    return {"result": f"No shipping found with tracking number {tracking_number}."}
