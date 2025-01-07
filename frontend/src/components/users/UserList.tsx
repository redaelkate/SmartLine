import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

/*const users = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    plan: 'Enterprise',
    joinDate: '2024-03-01',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces'
  },
  // ... more users
];*/

export function UserList() {

   const [users, setUsers] = React.useState([]);

   const [loading, setLoading] = React.useState(true);
   useEffect(()=>{
    const fetchUsers = async () => {
      try{
        const response = await axios.get('https://d0rgham.pythonanywhere.com/api/agents/');
        setUsers(response.data);
      }
      catch (error){
        console.error('Error fetching users', error);
      }
      finally{
        setLoading(false);
      }


    };
    fetchUsers();
   },[])

   if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#1D4ED8" size={50} />
      </div>
    );
  }
  
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creation Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full" src={user.avatar} alt="" />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.model}</div>
                      
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Date(user.created_at).split(' ').slice(1,4).join('/')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}