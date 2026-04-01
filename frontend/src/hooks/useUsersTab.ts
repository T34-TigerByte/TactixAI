import { useEffect, useReducer, useRef } from 'react';

import type { AdminUserListItem } from '../types/admin.types';
import { getUsersRequest, deleteUserRequest, getUserByIdRequest } from '../api/admin.api';

/* Types */

export type View = 'list' | 'create' | 'edit';

interface State {
  allUsers: AdminUserListItem[];
  filteredUsers: AdminUserListItem[];
  view: View;
  selectedUser: AdminUserListItem | null;
  deleteTarget: AdminUserListItem | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

// Explicitly declare all possible events that can change state
type Action =
  | { type: 'SET_USERS'; payload: AdminUserListItem[] }
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_SELECTED_USER'; payload: AdminUserListItem | null }
  | { type: 'SET_DELETE_TARGET'; payload: AdminUserListItem | null }
  | { type: 'CONFIRM_DELETE'; payload: number }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'FILTER_USERS' }
  | { type: 'CLEAR_SEARCH' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

/* Initial State */

const initialState: State = {
  allUsers: [],
  filteredUsers: [],
  view: 'list',
  selectedUser: null,
  deleteTarget: null,
  searchQuery: '',
  isLoading: false,
  error: null,
};

/* Reducer — centralizes all state change logic; every action and its effect is visible at a glance */

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, allUsers: action.payload, filteredUsers: action.payload };

    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'SET_SELECTED_USER':
      return { ...state, selectedUser: action.payload };

    case 'SET_DELETE_TARGET':
      return { ...state, deleteTarget: action.payload };

    // Atomically updates allUsers, filteredUsers, and deleteTarget in one dispatch
    case 'CONFIRM_DELETE': {
      const updated = state.allUsers.filter((u) => u.id !== action.payload);
      return { ...state, allUsers: updated, filteredUsers: updated, deleteTarget: null };
    }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'FILTER_USERS': {
      const q = state.searchQuery.toLowerCase();
      return {
        ...state,
        filteredUsers: state.allUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.company.toLowerCase().includes(q)
        ),
      };
    }

    case 'CLEAR_SEARCH':
      return { ...state, searchQuery: '', filteredUsers: state.allUsers };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

/* Hook */

export function useUsersTab() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // DOM refs for focus trap — kept outside reducer since they are imperative, not declarative state
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  // Initial data load
  useEffect(() => {
    const load = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const data = await getUsersRequest();
        dispatch({ type: 'SET_USERS', payload: data });
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load users. Please try again.' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    load();
  }, []);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (!state.error) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_ERROR', payload: null });
    }, 5000);
    return () => clearTimeout(timer);
  }, [state.error]);

  // Focus Cancel button when modal opens; restore focus to trigger when modal closes
  useEffect(() => {
    if (state.deleteTarget) {
      cancelButtonRef.current?.focus();
    } else {
      deleteTriggerRef.current?.focus();
      deleteTriggerRef.current = null;
    }
  }, [state.deleteTarget]);

  /* Async Actions — side effects handled outside the reducer */

  const reloadUsers = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const data = await getUsersRequest();
      dispatch({ type: 'SET_USERS', payload: data });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reload users. Please try again.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const confirmDelete = async () => {
    if (!state.deleteTarget) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      await deleteUserRequest(state.deleteTarget.id);
      dispatch({ type: 'CONFIRM_DELETE', payload: state.deleteTarget.id });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete user. Please try again.' });
      dispatch({ type: 'SET_DELETE_TARGET', payload: null });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Fetches detail data for a list item — does not update state; caller uses the return value for navigation
  const fetchUserById = async (user: AdminUserListItem) => {
    return await getUserByIdRequest(user.id);
  };

  return {
    state,
    dispatch,
    refs: { deleteTriggerRef, cancelButtonRef },
    actions: { reloadUsers, confirmDelete, fetchUserById },
  };
}
