import logging
from tools.call_agents import generate_summary
from tools.lead_generation_info import process_lead_conversation

class ConnectionClosedHandler(logging.Handler):
    def __init__(self, callback, transcript,phone,name):
        super().__init__()
        self.callback = callback
        self.transcript = transcript
        self.phone=phone
        self.name=name
        

    def emit(self, record):
        log_message = self.format(record)
        if "connection closed" in log_message.lower():
            self.callback(self.transcript,self.phone,self.name)


def execute_on_connection_closed(transcript,phone):
    print("Connection closed detected! Executing Closing Code...")
    print(phone)
    #process_lead_conversation
    print(transcript)
    print("Summary being generated...")
    summary = generate_summary(transcript)
    print(summary)


def execute_on_connection_closed_lead(transcript,phone,name):
    print("Connection closed detected! Executing Closing Code...")
    process_lead_conversation(transcript,phone,name)


def execute_on_connection_closed_support(transcript,phone):
    print("Connection closed detected! Executing Closing Code...")
    print(phone)
    #process_lead_conversation
    print(transcript)
    print("Summary being generated...")
    summary = generate_summary(transcript)
    print(summary)
