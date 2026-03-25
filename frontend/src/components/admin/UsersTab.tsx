import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import UserList from './UserList';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import { useUsersTab } from '../../hooks/useUsersTab';

export default function UsersTab() {
  const { state, dispatch, refs, actions } = useUsersTab();
  const { filteredUsers, view, selectedUser, deleteTarget, searchQuery, isLoading, error } = state;
  const { deleteTriggerRef, cancelButtonRef } = refs;

  const navigate = useNavigate();

  // Close modal with Escape + trap Tab focus within dialog
  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      dispatch({ type: 'SET_DELETE_TARGET', payload: null });
      return;
    }
    if (e.key === 'Tab') {
      const focusable = Array.from(
        e.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled])')
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleCheckDetails = (user: Parameters<typeof actions.fetchUserById>[0]) => {
    navigate(`/admin/users/${user.id}`, { state: { user } });
  };

  if (view === 'create') {
    return (
      <CreateUserForm onBack={() => dispatch({ type: 'SET_VIEW', payload: 'list' })} />
    );
  }

  if (view === 'edit' && selectedUser) {
    return (
      <EditUserForm
        user={selectedUser}
        onBack={async () => {
          await actions.reloadUsers();
          dispatch({ type: 'SET_VIEW', payload: 'list' });
        }}
      />
    );
  }

  return (
    <div className='space-y-4'>
      {/* Delete Confirm Dialog */}
      {deleteTarget && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
          onClick={() => dispatch({ type: 'SET_DELETE_TARGET', payload: null })}
        >
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='delete-dialog-title'
            aria-describedby='delete-dialog-desc'
            className='bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4'
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleDialogKeyDown}
          >
            <h3 id='delete-dialog-title' className='text-base font-semibold text-gray-800'>
              Delete User
            </h3>
            <p id='delete-dialog-desc' className='text-sm text-gray-600'>
              Are you sure you want to delete{' '}
              <span className='font-medium text-gray-900'>{deleteTarget.name}</span>?
              This action cannot be undone.
            </p>
            <div className='flex justify-end gap-3'>
              <button
                ref={cancelButtonRef}
                onClick={() => dispatch({ type: 'SET_DELETE_TARGET', payload: null })}
                className='px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50
                           text-gray-700 text-sm font-medium transition-colors cursor-pointer'
              >
                Cancel
              </button>
              <button
                onClick={actions.confirmDelete}
                disabled={isLoading}
                className='px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50
                           text-white text-sm font-medium transition-colors cursor-pointer'
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner — auto-dismisses after 5s, manual retry available */}
      {error && (
        <div
          role='alert'
          className='flex items-center justify-between rounded-lg bg-red-50 border border-red-200 px-4 py-3'
        >
          <p className='text-sm text-red-600'>{error}</p>
          <div className='flex items-center gap-3 ml-4'>
            <button
              onClick={actions.reloadUsers}
              className='text-red-600 hover:text-red-800 text-xs font-semibold cursor-pointer'
            >
              Retry
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
              aria-label='Dismiss error'
              className='text-red-400 hover:text-red-600 text-xs font-medium cursor-pointer'
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Create New User */}
      <div className='flex justify-end'>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'create' })}
          className='flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium
                     transition-colors cursor-pointer'
        >
          <Plus className='w-4 h-4' aria-hidden='true' />
          Create New User
        </button>
      </div>

      {/* Search Bar */}
      <div className='bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 flex flex-col sm:flex-row gap-3'>
        <div className='flex items-center gap-2 flex-1 bg-gray-100 rounded-lg px-3 py-2'>
          <Search className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
          <input
            type='search'
            aria-label='Search users by name or company'
            placeholder='Search user name or company name'
            value={searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') dispatch({ type: 'FILTER_USERS' }); }}
            className='bg-transparent flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400'
          />
        </div>
        <div className='flex gap-3 sm:contents'>
          <button
            onClick={() => dispatch({ type: 'FILTER_USERS' })}
            className='flex-2 sm:flex-none px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700
                       text-white text-sm font-medium transition-colors cursor-pointer'
          >
            Search
          </button>
          <button
            onClick={() => dispatch({ type: 'CLEAR_SEARCH' })}
            className='flex-1 sm:flex-none px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50
                       text-gray-700 text-sm font-medium transition-colors cursor-pointer'
          >
            Clear
          </button>
        </div>
      </div>

      {/* User Overview Table */}
      <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
        <div className='bg-slate-900 px-6 py-4'>
          <h3 className='text-white font-semibold'>User Overview</h3>
        </div>

        {/* Loading skeleton — row count matches previous data to prevent layout shift */}
        {isLoading ? (
          <div className='bg-white divide-y divide-gray-100' aria-busy='true' aria-label='Loading users'>
            {Array.from({ length: state.allUsers.length || 4 }).map((_, i) => (
              <div key={i} className='px-6 py-4 flex gap-4 animate-pulse'>
                <div className='flex-1 space-y-2'>
                  <div className='h-3 bg-gray-200 rounded w-1/3' />
                  <div className='h-2 bg-gray-100 rounded w-1/4' />
                </div>
                <div className='h-3 bg-gray-200 rounded w-1/5' />
                <div className='h-3 bg-gray-200 rounded w-1/5' />
              </div>
            ))}
          </div>
        ) : (
          <div aria-live='polite' aria-atomic='false'>
            <UserList
              users={filteredUsers}
              onCheckDetails={handleCheckDetails}
              onEdit={(user) => {
                dispatch({ type: 'SET_SELECTED_USER', payload: user });
                dispatch({ type: 'SET_VIEW', payload: 'edit' });
              }}
              onDelete={(user, trigger) => {
                deleteTriggerRef.current = trigger;
                dispatch({ type: 'SET_DELETE_TARGET', payload: user });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
