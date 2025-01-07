import { CallHistory } from '../types/CallHistory';

export const mockCallHistory: CallHistory[] = [
  {
    id: 1,
    clientName: 'John Doe',
    summary: 'Discussed project requirements',
    time: '2023-10-01 10:30 AM',
    duration: 900, // 15 minutes
    callType: 'Outgoing',
    callStatus: 'Completed',
    callRating: 5,
    agentName: 'Alice',
  },
  {
    id: 2,
    clientName: 'Jane Smith',
    summary: 'Follow-up on contract details',
    time: '2023-10-02 02:15 PM',
    duration: 600, // 10 minutes
    callType: 'Incoming',
    callStatus: 'Completed',
    callRating: 4,
    agentName: 'Bob',
  },
  {
    id: 3,
    clientName: 'Alice Johnson',
    summary: 'Resolved technical issues',
    time: '2023-10-03 11:00 AM',
    duration: 1200, // 20 minutes
    callType: 'Outgoing',
    callStatus: 'Completed',
    callRating: 5,
    agentName: 'Charlie',
  },
  {
    id: 4,
    clientName: 'Bob Brown',
    summary: 'Missed call',
    time: '2023-10-04 09:00 AM',
    duration: 0, // 0 minutes
    callType: 'Missed',
    callStatus: 'Missed',
    callRating: 1,
    agentName: 'Alice',
  },
];