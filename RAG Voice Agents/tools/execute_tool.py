import json

from tools.search_product_tool import search_product_tool
from tools.process_order_tool import process_order_tool
from tools.check_shipping_status_tool import check_shipping_status_tool
from tools.check_stock_tool import check_stock_tool
from tools.catalogue_agent import check_catalogue_tool
import logging

function_mapping = {
    'search_product': search_product_tool,
    'process_order': process_order_tool,
    'check_shipping_status': check_shipping_status_tool,
    'check_stock': check_stock_tool,
    'check_catalogue' : check_catalogue_tool
}


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)


async def execute_tool(json_data):
    function_name = json_data.get('name')
    arguments = json.loads(json_data.get('arguments'))

    if function_name in function_mapping:
        logging.info(f"Executing tool: {function_name} with arguments: {arguments}")
        function_to_call = function_mapping[function_name]
        try:
            result = await function_to_call(arguments)
            logging.info(f"Tool {function_name} executed successfully")
            return result
        except Exception as e:
            logging.error(f"Error executing tool {function_name}: {str(e)}")
            raise
    else:
        logging.warning(f"Function {function_name} not found")
        return {"error": f"Function {function_name} not found."}
