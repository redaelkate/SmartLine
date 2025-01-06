import json

from tools.search_product_tool import search_product_tool
from tools.process_order_tool import process_order_tool
from tools.check_shipping_status_tool import check_shipping_status_tool
from tools.check_stock_tool import check_stock_tool

function_mapping = {
    'search_product': search_product_tool,
    'process_order': process_order_tool,
    'check_shipping_status': check_shipping_status_tool,
    'check_stock': check_stock_tool
}

async def execute_tool(json_data):
    function_name = json_data.get('name')
    arguments = json.loads(json_data.get('arguments'))

    if function_name in function_mapping:
        function_to_call = function_mapping[function_name]
        result = await function_to_call(arguments)
        return result
    else:
        return {"error": f"Function {function_name} not found."}
