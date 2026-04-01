import { useEffect, useReducer } from 'react';

import type { LearnerActivity } from '../schemas/api.schema';
import { getUserActivitiesRequest } from '../api/admin.api';

interface State {
  activities: LearnerActivity[];
  isLoading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_ACTIVITIES'; payload: LearnerActivity[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: State  = {
    activities: [],
    isLoading: false,
    error: null
}

function reducer(state: State, action: Action): State {
    switch(action.type) {
        case 'SET_ACTIVITIES':
            return {...state, activities: action.payload }

        case 'SET_LOADING':
            return {...state, isLoading: action.payload }
        case 'SET_ERROR':
            return {...state, error: action.payload }
        default:
            return state;
    }
}

export function useOverviewTab() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const load = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const data = await getUserActivitiesRequest();
        dispatch({ type: 'SET_ACTIVITIES', payload: data });
      } catch {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed fetching user activities. Please try again.',
        });
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

  return {
    state,
    dispatch,
  }
}