import { useState } from 'react';
import { Plus, Search } from 'lucide-react';

import type { AdminUserListItem } from '../../types/admin.types';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';

type View = 'list' | 'create' | 'edit';

const MOCK_USERS: AdminUserListItem[] = [
  {
    username: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    role: 'learner',
    company: 'TechCorp Inc.',
    created_at: '2024-01-15',
    updated_at: '2024-03-15',
    last_session: '2024-03-15',
    completed_sessions: 24,
    time_spent: 1080,
  },
  {
    username: 'John Doe',
    email: 'john.doe@company.com',
    role: 'learner',
    company: 'SunCorp Inc.',
    created_at: '2024-01-15',
    updated_at: '2024-03-15',
    last_session: '2024-03-15',
    completed_sessions: 24,
    time_spent: 1080,
  },
  {
    username: 'Lina Lee',
    email: 'lina.lee@company.com',
    role: 'learner',
    company: 'TechCorp Inc.',
    created_at: '2024-01-15',
    updated_at: '2024-03-15',
    last_session: '2024-03-15',
    completed_sessions: 24,
    time_spent: 1080,
  },
];

export default function UsersTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(MOCK_USERS);
  const [view, setView] = useState<View>('list'); // initially users list
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);

  const navigate = useNavigate();

  const handleCheckDetails = (user: AdminUserListItem) => {
    navigate(`/admin/users/${user.email}`, { state: { user } }); // TODO: replace with userId after API connects
  }

  const handleClickEdit = (user: AdminUserListItem) => {
    setSelectedUser(user);
    setView('edit');
  }

  const handleClickCreateUser = () => {
    setView('create');
  }

  const handleSearch = () => {
    const q = searchQuery.toLowerCase();
    setFilteredUsers(
      MOCK_USERS.filter(
        (u) =>
          u.username.toLowerCase().includes(q) ||
          u.company?.toLowerCase().includes(q)
      )
    );
  };

  const handleClear = () => {
    setSearchQuery('');
    setFilteredUsers(MOCK_USERS);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  // TODO: open Create modal
  const handleCreateUser = () => {};

  // TODO: show Edit view
  const handleEdit: (user: AdminUserListItem) => void = () => {};

  // TODO: show Delete confirm view
  const handleDelete: (user: AdminUserListItem) => void = () => {};

  return (
    <div className='space-y-4'>
      {/* Create New User */}
      <div className='flex justify-end'>
        <button
          onClick={handleCreateUser}
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
        { view === 'list' ? 
          <>
            <div className='bg-slate-900 px-6 py-4'>
              <h3 className='text-white font-semibold'>User Overview</h3>
            </div>
            <UserList
              users={filteredUsers}
              onCheckDetails={handleCheckDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
              />
          </>
          : view === 'create' ? 
          <div>
          </div>
          : 
          <div>
            
          </div>
        }
      </div>
    </div>
  );
}
