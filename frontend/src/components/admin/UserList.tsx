import { Eye, Pencil, Trash2 } from 'lucide-react';

import type { AdminUserListItem } from '../../types/admin.types';

interface Props {
  users: AdminUserListItem[];
  onCheckDetails: (user: AdminUserListItem) => void;
  onEdit: (user: AdminUserListItem) => void;
  onDelete: (user: AdminUserListItem) => void;
}

export default function UserList({ users, onCheckDetails, onEdit, onDelete }: Props) {
    
  return (
    <div className='bg-white rounded-b-xl overflow-hidden'>
      <table className='w-full text-sm'>
        <thead className='bg-slate-900 text-white'>
          <tr>
            <th className='text-left px-6 py-4 font-medium'>Name</th>
            <th className='text-left px-6 py-4 font-medium'>Company</th>
            <th className='text-left px-6 py-4 font-medium'>Last Session</th>
            <th className='text-left px-6 py-4 font-medium'>Completed Sessions</th>
            <th className='text-left px-6 py-4 font-medium'>Time Spent</th>
            <th className='text-left px-6 py-4 font-medium'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {users.map((user) => (
            <tr key={user.email} className='hover:bg-gray-50'>
              <td className='px-6 py-4'>
                <p className='font-semibold text-gray-900'>{user.username}</p>
                <p className='text-gray-400 text-xs'>{user.email}</p>
                <p className='text-gray-400 text-xs'>Joined {user.created_at}</p>
              </td>
              <td className='px-6 py-4 text-gray-700'>{user.company ?? '—'}</td>
              <td className='px-6 py-4 text-gray-700'>{user.last_session ?? '—'}</td>
              <td className='px-6 py-4 text-gray-700'>{user.completed_sessions ?? '—'}</td>
              <td className='px-6 py-4 text-gray-500'>
                {user.time_spent != null ? `${user.time_spent} mins` : '—'}
              </td>
              <td className='px-6 py-4'>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => onCheckDetails(user)}
                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                               bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium
                               transition-colors cursor-pointer'
                  >
                    <Eye className='w-3.5 h-3.5' />
                    Check Details
                  </button>
                  <button
                    onClick={() => onEdit(user)}
                    className='p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100
                               text-gray-600 transition-colors cursor-pointer'
                  >
                    <Pencil className='w-3.5 h-3.5' />
                  </button>
                  {user.role === 'learner' && (
                    <button
                      onClick={() => onDelete(user)}
                      className='p-1.5 rounded-lg border border-gray-300 hover:bg-red-50
                                 text-red-500 transition-colors cursor-pointer'
                    >
                      <Trash2 className='w-3.5 h-3.5' />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users && users.length === 0 && (
        <p className='text-center text-gray-400 py-12'>No users found.</p>
      )}
    </div>
  );
}
