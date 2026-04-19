import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { AdminUserListItem } from '../schemas/api.schema';
import { getUsersRequest, deleteUserRequest, getUserByIdRequest } from '../api/admin.api';

/* Types */

export type View = 'list' | 'create' | 'edit';

// UI-only state — server state is managed by TanStack Query
interface UIState {
  view: View;
  selectedUser: AdminUserListItem | null;
  deleteTarget: AdminUserListItem | null;
  searchQuery: string;
  appliedSearch: string;
  error: string | null;
}

type UIAction =
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_SELECTED_USER'; payload: AdminUserListItem | null }
  | { type: 'SET_DELETE_TARGET'; payload: AdminUserListItem | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'FILTER_USERS' }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'SET_ERROR'; payload: string | null };

const initialUIState: UIState = {
  view: 'list',
  selectedUser: null,
  deleteTarget: null,
  searchQuery: '',
  appliedSearch: '',
  error: null,
};

function uiReducer(state: UIState, action: UIAction): UIState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload };
    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: action.payload };
    case 'SET_DELETE_TARGET':
      return { ...state, deleteTarget: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'FILTER_USERS':
      return { ...state, appliedSearch: state.searchQuery };
    case 'CLEAR_SEARCH':
      return { ...state, searchQuery: '', appliedSearch: '' };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

/* Hook */

export function useUsersTab() {
  const queryClient = useQueryClient();
  const [cursor, setCursor] = useState<string | undefined>();
  const [uiState, dispatch] = useReducer(uiReducer, initialUIState);

  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  /* Server state */

  const { data, isLoading: isQueryLoading, error: queryError, refetch } = useQuery({
    queryKey: ['admin', 'users', cursor],
    queryFn: () => getUsersRequest(cursor),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', cursor] });
    },
    onError: () => {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete user. Please try again.' });
      dispatch({ type: 'SET_DELETE_TARGET', payload: null });
    },
  });

  /* Derived state */

  const allUsers = data?.data ?? [];

  const filteredUsers = useMemo(() => {
    if (!uiState.appliedSearch) return allUsers;
    const q = uiState.appliedSearch.toLowerCase();
    return allUsers.filter(
      (u) => u.name.toLowerCase().includes(q) || u.company.toLowerCase().includes(q)
    );
  }, [allUsers, uiState.appliedSearch]);

  // Merge query error and mutation error for display
  const error = uiState.error ?? (queryError ? 'Failed to load users. Please try again.' : null);
  const isLoading = isQueryLoading || deleteMutation.isPending;

  /* Side effects */

  // Auto-dismiss mutation errors after 5 seconds
  useEffect(() => {
    if (!uiState.error) return;
    const timer = setTimeout(() => dispatch({ type: 'SET_ERROR', payload: null }), 5000);
    return () => clearTimeout(timer);
  }, [uiState.error]);

  // Focus trap for delete modal
  useEffect(() => {
    if (uiState.deleteTarget) {
      cancelButtonRef.current?.focus();
    } else {
      deleteTriggerRef.current?.focus();
      deleteTriggerRef.current = null;
    }
  }, [uiState.deleteTarget]);

  /* Actions */

  const reloadUsers = () => refetch();

  const nextPage = () => {
    if (data?.pagination.has_next && data.pagination.next_cursor) {
      setCursor(data.pagination.next_cursor);
    }
  };

  const prevPage = () => {
    if (data?.pagination.has_prev && data.pagination.prev_cursor) {
      setCursor(data.pagination.prev_cursor);
    }
  };

  const confirmDelete = async () => {
    if (!uiState.deleteTarget) return;
    await deleteMutation.mutateAsync(uiState.deleteTarget.id);
    dispatch({ type: 'SET_DELETE_TARGET', payload: null });
  };

  const fetchUserById = (user: AdminUserListItem) => getUserByIdRequest(user.id);

  // Expose merged state with same shape as before so UsersTab.tsx needs no changes
  const state = {
    filteredUsers,
    view: uiState.view,
    selectedUser: uiState.selectedUser,
    deleteTarget: uiState.deleteTarget,
    searchQuery: uiState.searchQuery,
    pagination: data?.pagination ?? null,
    total: data?.total ?? 0,
    isLoading,
    error,
  };

  return {
    state,
    dispatch,
    refs: { deleteTriggerRef, cancelButtonRef },
    actions: { reloadUsers, confirmDelete, fetchUserById, nextPage, prevPage },
  };
}
