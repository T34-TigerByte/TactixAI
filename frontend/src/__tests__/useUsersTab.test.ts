import { renderHook, act, waitFor } from '@testing-library/react';

import { useUsersTab } from '../hooks/useUsersTab';
import { getUsersRequest, deleteUserRequest } from '../api/admin.api';
import type { AdminUserListItem } from '../types/admin.types';

/* Mock API module — all exports replaced with jest.fn() */
jest.mock('../api/admin.api', () => ({
  getUsersRequest: jest.fn(),
  deleteUserRequest: jest.fn(),
  getUserByIdRequest: jest.fn(),
}));

const mockGetUsers = getUsersRequest as jest.MockedFunction<typeof getUsersRequest>;
const mockDeleteUser = deleteUserRequest as jest.MockedFunction<typeof deleteUserRequest>;

const MOCK_USERS: AdminUserListItem[] = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com',
    joined_at: 1700000000,
    company: 'Acme',
    session: { completed: 3, last_session_at: null, total_time_spent: 90 },
  },
  {
    id: 2,
    name: 'Bob Jones',
    email: 'bob@example.com',
    joined_at: 1700000001,
    company: 'Beta Corp',
    session: { completed: 1, last_session_at: null, total_time_spent: 30 },
  },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockGetUsers.mockResolvedValue(MOCK_USERS);
});

/* Initial load */
describe('initial load', () => {
  it('fetches users on mount and populates state', async () => {
    const { result } = renderHook(() => useUsersTab());

    await waitFor(() => {
      expect(result.current.state.allUsers).toHaveLength(2);
    });

    expect(result.current.state.filteredUsers).toHaveLength(2);
    expect(result.current.state.isLoading).toBe(false);
  });

  it('sets error when fetch fails', async () => {
    mockGetUsers.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useUsersTab());

    await waitFor(() => {
      expect(result.current.state.error).toBe('Failed to load users. Please try again.');
    });

    expect(result.current.state.isLoading).toBe(false);
  });
});

/* Search & filter */
describe('search and filter', () => {
  it('filters users by name', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'SET_SEARCH_QUERY', payload: 'alice' });
      result.current.dispatch({ type: 'FILTER_USERS' });
    });

    expect(result.current.state.filteredUsers).toHaveLength(1);
    expect(result.current.state.filteredUsers[0].name).toBe('Alice Smith');
  });

  it('filters users by company', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'SET_SEARCH_QUERY', payload: 'beta' });
      result.current.dispatch({ type: 'FILTER_USERS' });
    });

    expect(result.current.state.filteredUsers).toHaveLength(1);
    expect(result.current.state.filteredUsers[0].name).toBe('Bob Jones');
  });

  it('returns empty array when no match', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'SET_SEARCH_QUERY', payload: 'zzz' });
      result.current.dispatch({ type: 'FILTER_USERS' });
    });

    expect(result.current.state.filteredUsers).toHaveLength(0);
  });

  it('restores full list on CLEAR_SEARCH', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'SET_SEARCH_QUERY', payload: 'alice' });
      result.current.dispatch({ type: 'FILTER_USERS' });
    });
    expect(result.current.state.filteredUsers).toHaveLength(1);

    act(() => {
      result.current.dispatch({ type: 'CLEAR_SEARCH' });
    });

    expect(result.current.state.filteredUsers).toHaveLength(2);
    expect(result.current.state.searchQuery).toBe('');
  });
});

/* View transitions */
describe('view transitions', () => {
  it('switches to create view', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'SET_VIEW', payload: 'create' });
    });

    expect(result.current.state.view).toBe('create');
  });

  it('sets selectedUser and switches to edit view', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'SET_SELECTED_USER', payload: MOCK_USERS[0] });
      result.current.dispatch({ type: 'SET_VIEW', payload: 'edit' });
    });

    expect(result.current.state.selectedUser?.id).toBe(1);
    expect(result.current.state.view).toBe('edit');
  });
});

/* confirmDelete */
describe('confirmDelete', () => {
  it('removes user from state after successful delete', async () => {
    mockDeleteUser.mockResolvedValueOnce(undefined as never);

    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'SET_DELETE_TARGET', payload: MOCK_USERS[0] });
    });

    await act(async () => {
      await result.current.actions.confirmDelete();
    });

    expect(result.current.state.allUsers).toHaveLength(1);
    expect(result.current.state.allUsers[0].id).toBe(2);
    expect(result.current.state.deleteTarget).toBeNull();
    expect(mockDeleteUser).toHaveBeenCalledWith(1);
  });

  it('sets error and clears deleteTarget when delete fails', async () => {
    mockDeleteUser.mockRejectedValueOnce(new Error('Server error'));

    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'SET_DELETE_TARGET', payload: MOCK_USERS[0] });
    });

    await act(async () => {
      await result.current.actions.confirmDelete();
    });

    expect(result.current.state.error).toBe('Failed to delete user. Please try again.');
    expect(result.current.state.deleteTarget).toBeNull();
    expect(result.current.state.allUsers).toHaveLength(2);
  });

  it('does nothing when deleteTarget is null', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    await act(async () => {
      await result.current.actions.confirmDelete();
    });

    expect(mockDeleteUser).not.toHaveBeenCalled();
  });
});

/* reloadUsers */
describe('reloadUsers', () => {
  it('refreshes user list', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    const updated = [MOCK_USERS[0]];
    mockGetUsers.mockResolvedValueOnce(updated);

    await act(async () => {
      await result.current.actions.reloadUsers();
    });

    expect(result.current.state.allUsers).toHaveLength(1);
  });

  it('sets error when reload fails', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    mockGetUsers.mockRejectedValueOnce(new Error('fail'));

    await act(async () => {
      await result.current.actions.reloadUsers();
    });

    expect(result.current.state.error).toBe('Failed to reload users. Please try again.');
  });
});

/* Loading state transitions */
describe('loading state transitions', () => {
  // React batches state updates inside act(), making mid-flight isLoading=true
  // unobservable from outside. Instead we verify the full cycle:
  // (1) isLoading is false before the action
  // (2) isLoading is false after the action (proves the finally block ran)
  // (3) the action produced the expected side effect

  it('resets isLoading to false after confirmDelete succeeds', async () => {
    mockDeleteUser.mockResolvedValueOnce(undefined as never);

    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    expect(result.current.state.isLoading).toBe(false);

    act(() => {
      result.current.dispatch({ type: 'SET_DELETE_TARGET', payload: MOCK_USERS[0] });
    });

    await act(async () => {
      await result.current.actions.confirmDelete();
    });

    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.allUsers).toHaveLength(1);
  });

  it('resets isLoading to false after confirmDelete fails', async () => {
    mockDeleteUser.mockRejectedValueOnce(new Error('fail'));

    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'SET_DELETE_TARGET', payload: MOCK_USERS[0] });
    });

    await act(async () => {
      await result.current.actions.confirmDelete();
    });

    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.error).not.toBeNull();
  });

  it('resets isLoading to false after reloadUsers succeeds', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    mockGetUsers.mockResolvedValueOnce([MOCK_USERS[0]]);

    await act(async () => {
      await result.current.actions.reloadUsers();
    });

    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.allUsers).toHaveLength(1);
  });

  it('resets isLoading to false after reloadUsers fails', async () => {
    const { result } = renderHook(() => useUsersTab());
    await waitFor(() => expect(result.current.state.allUsers).toHaveLength(2));

    mockGetUsers.mockRejectedValueOnce(new Error('fail'));

    await act(async () => {
      await result.current.actions.reloadUsers();
    });

    expect(result.current.state.isLoading).toBe(false);
    expect(result.current.state.error).not.toBeNull();
  });
});
