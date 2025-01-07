export interface CallHistory {
  id: number;
  clientName: string;
  summary: string;
  time: string; // You can use a Date object or a string for simplicity
  duration: number; // Duration in seconds
  callType: 'Incoming' | 'Outgoing' | 'Missed'; // Type of call
  callStatus: 'Completed' | 'Missed' | 'Voicemail'; // Status of the call
  callRating?: number; // Optional rating (1 to 5)
  agentName: string; // Name of the agent handling the call
}