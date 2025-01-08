import logging
from services.openai_functions import generate_summary

# Custom logging handler to watch for "connection closed"
class ConnectionClosedHandler(logging.Handler):
    def __init__(self, callback, transcript):
        super().__init__()
        self.callback = callback
        self.transcript = transcript

    def emit(self, record):
        log_message = self.format(record)
        if "connection closed" in log_message.lower():  # Case-insensitive check
            self.callback(self.transcript)

# Function to execute when "connection closed" is detected
def execute_on_connection_closed(transcript):
    print("Connection closed detected! Executing custom logic...")
    print(transcript)
    print("Summary being generated...")
    summary = generate_summary(transcript)
    print(summary)