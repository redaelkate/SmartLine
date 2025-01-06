import os
import json
import aiofiles

async def read_json_file(filename):
    folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dummy_db')

    file_path = os.path.join(folder, filename)

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"The file {file_path} does not exist.")

    async with aiofiles.open(file_path, 'r') as file:
        content = await file.read()
        return json.loads(content)
