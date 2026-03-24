import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';

import type { AdminUserListItem } from '../../types/admin.types';
import UserList from './UserList';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import { useNavigate } from 'react-router-dom';
import { getUsersRequest, deleteUserRequest, getUserByIdRequest } from '../../api/admin.api';

type View = 'list' | 'create' | 'edit';

export default function UsersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<AdminUserListItem[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUserListItem[]>([]);
  const [view, setView] = useState<View>('list');
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserListItem | null>(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    const data = await getUsersRequest();
    setAllUsers(data);
    setFilteredUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCheckDetails = async (user: AdminUserListItem) => {
    try {
      const userData = await getUserByIdRequest(user.id);
      setSelectedUser(userData);

      // Navigate immediately with the fetched data
      navigate(`/admin/users/${userData.id}`, { state: { user: userData } });

    } catch(error) {
      console.log(error.message)
    } 
  };

  const handleEdit = (user: AdminUserListItem) => {
    setSelectedUser(user);
    setView('edit');
  };

  const handleDelete = (user: AdminUserListItem) => {
    setDeleteTarget(user);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    // TODO: await deleteUserRequest(deleteTarget.id);
    await deleteUserRequest(deleteTarget.id);
    const updated = allUsers.filter((u) => u.id !== deleteTarget.id);
    setAllUsers(updated);
    setFilteredUsers(updated);
    setDeleteTarget(null);
  };

  const handleSearch = () => {
    const q = searchQuery.toLowerCase();
    setFilteredUsers(
      allUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.company.toLowerCase().includes(q)
      )
    );
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilteredUsers(allUsers);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  if (view === 'create') {
    return <CreateUserForm onBack={() => setView('list')} />;
  }

  if (view === 'edit' && selectedUser) {
    return (
      <EditUserForm
        user={selectedUser}
        onBack={async () => {
          await fetchUsers();
          setView('list');
        }}
      />
    );
  }

  return (
    <div className='space-y-4'>
      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4'>
            <h3 className='text-base font-semibold text-gray-800'>Delete User</h3>
            <p className='text-sm text-gray-600'>
              Are you sure you want to delete{' '}
              <span className='font-medium text-gray-900'>{deleteTarget.name}</span>?
              This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setDeleteTarget(null)}
                className='px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50
                           text-gray-700 text-sm font-medium transition-colors cursor-pointer'
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700
                           text-white text-sm font-medium transition-colors cursor-pointer'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New User */}
      <div className='flex justify-end'>
        <button
          onClick={() => setView('create')}
          className='flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium
                     transition-colors cursor-pointer'
        >
          <Plus className='w-4 h-4' />
          Create New User
        </button>
      </div>

      {/* Search Bar */}
      <div className='bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex gap-3'>
        <div className='flex items-center gap-2 flex-1 bg-gray-100 rounded-lg px-3 py-2'>
          <Search className='w-4 h-4 text-gray-400 shrink-0' />
          <input
            type='text'
            placeholder='Search user name or company name'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className='bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400'
          />
        </div>
        <button
          onClick={handleSearch}
          className='px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700
                     text-white text-sm font-medium transition-colors cursor-pointer'
        >
          Search
        </button>
        <button
          onClick={handleClear}
          className='px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50
                     text-gray-700 text-sm font-medium transition-colors cursor-pointer'
        >
          Clear
        </button>
      </div>

      {/* User Overview Table */}
      <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
        <div className='bg-slate-900 px-6 py-4'>
          <h3 className='text-white font-semibold'>User Overview</h3>
        </div>
        <UserList
          users={filteredUsers}
          onCheckDetails={handleCheckDetails}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
