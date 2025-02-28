import React, { useState, useEffect } from 'react';
import {XCircle, Edit, Trash2 } from 'lucide-react'; // Lucide icons

const AIAgentForm = ({ agent, onSubmit, onCancel }) => {
  const [name, setName] = useState(agent ? agent.name : '');
  const [model, setModel] = useState(agent ? agent.model : '');
  const [status, setStatus] = useState(agent ? agent.status : '');
  const [organization, setOrganization] = useState(agent ? agent.organization : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', { name, model, status, organization }); // Debugging: Log form data
    onSubmit({
      name,
      model,
      status,
      organization,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Model</label>
        <input
          type="text"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Organization ID</label>
        <input
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {agent ? 'Update' : 'Create'}
        </button>
        {agent && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const AIAgentList = ({ agents, onEdit, onDelete }) => {
  return (
    <div className="mt-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Model
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Organization
            </th>
            <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{agent.name}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{agent.model}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{agent.status}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{agent.organization}</td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                <button
                  onClick={() => onEdit(agent)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit size={20} className="inline-block" />
                </button>
                <button
                  onClick={() => onDelete(agent.id)}
                  className="ml-2 text-red-600 hover:text-red-900"
                >
                  <Trash2 size={20} className="inline-block" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AIAgentManager = () => {
  const [agents, setAgents] = useState([]);
  const [editingAgent, setEditingAgent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch agents from the API
    fetch('http://127.0.0.1:8000/api/agents/')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched agents:', data); // Debugging: Log fetched data
        setAgents(data);
      })
      .catch((error) => {
        console.error('Error fetching agents:', error); // Debugging: Log fetch error
      });
  }, []);

  const handleCreateOrUpdateAgent = (agentData) => {
    console.log('Sending payload:', agentData); // Debugging: Log payload
    if (editingAgent) {
      // Update existing agent
      fetch(`http://127.0.0.1:8000/api/agents/${editingAgent.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentData),
      })
        .then((response) => response.json())
        .then((updatedAgent) => {
          console.log('Updated Agent:', updatedAgent); // Debugging: Log updated agent
          setAgents(agents.map((a) => (a.id === updatedAgent.id ? updatedAgent : a)));
          setEditingAgent(null);
          setOpenDialog(false);
        })
        .catch((error) => {
          console.error('Error updating agent:', error); // Debugging: Log update error
        });
    } else {
      // Create new agent
      fetch('http://127.0.0.1:8000/api/agents/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agentData),
      })
        .then((response) => response.json())
        .then((newAgent) => {
          console.log('Created Agent:', newAgent); // Debugging: Log created agent
          setAgents([...agents, newAgent]);
          setOpenDialog(false);
        })
        .catch((error) => {
          console.error('Error creating agent:', error); // Debugging: Log create error
        });
    }
  };

  const handleDeleteAgent = (agentId) => {
    fetch(`/api/agents/${agentId}/`, {
      method: 'DELETE',
    })
      .then(() => {
        console.log('Deleted Agent:', agentId); // Debugging: Log deleted agent
        setAgents(agents.filter((a) => a.id !== agentId));
      })
      .catch((error) => {
        console.error('Error deleting agent:', error); // Debugging: Log delete error
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Agent Manager </h1>
      <button
        onClick={() => {
          setEditingAgent(null);
          setOpenDialog(true);
        }}
        className="mb-6 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Create New Agent
      </button>
      <AIAgentList
        agents={agents}
        onEdit={(agent) => {
          setEditingAgent(agent);
          setOpenDialog(true);
        }}
        onDelete={handleDeleteAgent}
      />
      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
           <div className='flex justify-between'> <h2 className="text-lg font-semibold mb-4">
              {editingAgent ? 'Edit AI Agent' : 'Create AI Agent'}
            </h2> <XCircle className='cursor-pointer' onClick={()=>{setOpenDialog(false)}} /></div>
            <AIAgentForm
              agent={editingAgent}
              onSubmit={handleCreateOrUpdateAgent}
              onCancel={() => setOpenDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAgentManager;