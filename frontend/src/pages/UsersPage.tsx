import React from 'react';
import { UserList } from '../components/users/UserList';
import { UserFilters } from '../components/users/UserFilters';

export function UsersPage() {
  return (
    <div className='m-4 p-4 border-r-2  border-gray-200 rounded-lg bg-white shadow-lg' >
      <div className="mb-8 ">
        <h1 className="text-2xl font-bold text-gray-900">Clients Management</h1>
        <p className="text-gray-600 mt-1">Manage your Clients</p>
      </div>
      
      <UserFilters />
      <UserList />
    </div>
  );
}