import React, { useState, useEffect } from 'react';
import axios, { Axios, isAxiosError } from 'axios';
import { ClipLoader } from 'react-spinners';
import { User2, XCircle, Trash2, Edit, Plus } from 'lucide-react';
import Modal from '../Modal';
import axiosInstance from '../../axios';

interface User {
  id: number;
  name: string;
  organization: string;
  email: string;
  created_at: string;
  phone_number: string;
  updated_at: string;
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone_number: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('api/clients/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDisplayUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setIsEditing(false);
    setFormData({
      name: user.name,
      organization: user.organization,
      email: user.email,
      phone_number: user.phone_number,
    });
  };

  const handleEditUser = () => {
    setIsEditing(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await axiosInstance.put(
        `api/clients/${selectedUser.id}/`,
        formData
      );
      setUsers(users.map((user) => (user.id === selectedUser.id ? response.data : user)));
      setIsEditing(false);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating user', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await axiosInstance.delete(`api/clients/${selectedUser.id}/`);
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleCreateUser = async () => {
    // Validate form data
    if (!formData.name || !formData.email || !formData.organization || !formData.phone_number) {
      alert('Please fill out all fields.');
      return;
    }
  
    try {
      const response = await axiosInstance.post('api/clients/', formData);
      setUsers([...users, response.data]);
      setIsCreating(false);
      setIsModalOpen(false);
      setFormData({
        name: '',
        organization: '',
        email: '',
        phone_number: '',
      });
    } catch (error) {
      console.error('Error creating user:', error);
  
      // Log the error response from the server
      if (isAxiosError(error) && error.response) {
        console.error('Server response:', error.response.data);
      }
  
      alert('Failed to create user. Please check the console for more details.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#1D4ED8" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => {
            setIsCreating(true);
            setIsModalOpen(true);
            setFormData({
              name: '',
              organization: '',
              email: '',
              phone_number: '',
            });
          }}
        >
          <Plus className="w-4 h-4" /> Create User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creation Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="cursor-pointer" onClick={() => handleDisplayUser(user)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User2 className="w-8 h-8 text-gray-500" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toDateString().split(' ').slice(1, 4).join('/')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDisplayUser(user);
                      handleEditUser();
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {isCreating ? (
          <div>
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-4">{selectedUser!=null ? "modify Clients"+selectedUser.name : "Create User"} </h3>
              <XCircle className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="organization"
                placeholder="Organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={handleCreateUser}
              >
                {selectedUser==null ? "Save": "Create"}
              </button>
            </div>
          </div>
        ) : selectedUser ? (
          <div>
            <div className="flex justify-between">
              <h3 className="text-xl font-semibold mb-4">User Details</h3>
              <XCircle className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={handleSaveUser}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedUser.name}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone_number}</p>
                <p><strong>Organization:</strong> {selectedUser.organization}</p>
                <p><strong>Creation Date:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                <p><strong>Updated Date:</strong> {new Date(selectedUser.updated_at).toLocaleDateString()}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={handleEditUser}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteUser}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}