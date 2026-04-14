import type { SessionDetails } from '../schemas/api.schema';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Message {
  id: string;
  sender: 'system' | 'user';
  content: string;
  timestamp: string;
}

// ── State ─────────────────────────────────────────────────────────────────────

export interface ChatRoomState {
  // session
  sessionUuid: string | null;
  sessionDetails: SessionDetails | null;
  timeLeft: number;
  sessionError: string | null;
  // chat
  messages: Message[];
  inputText: string;
  // ui
  showWarning: boolean;
  mobileTab: 'chat' | 'tasks';
  // tasks
  taskAnswers: Record<string, string[]>;
}

export const initialState: ChatRoomState = {
  sessionUuid: null,
  sessionDetails: null,
  timeLeft: 0,
  sessionError: null,
  messages: [],
  inputText: '',
  showWarning: false,
  mobileTab: 'chat',
  taskAnswers: {},
};

// ── Actions ───────────────────────────────────────────────────────────────────

export type Action =
  | { type: 'SESSION_INIT'; sessionUuid: string; sessionDetails: SessionDetails; timeLeft: number; welcomeMessage: Message }
  | { type: 'SESSION_ERROR'; error: string }
  | { type: 'SESSION_RESET' }
  | { type: 'TICK' }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SET_INPUT'; text: string }
  | { type: 'CLEAR_INPUT' }
  | { type: 'SET_MOBILE_TAB'; tab: 'chat' | 'tasks' }
  | { type: 'SET_SHOW_WARNING'; show: boolean }
  | { type: 'TOGGLE_TASK_OPTION'; questionKey: string; answerKey: string; mode: 'radio' | 'checkbox' };

// ── Reducer ───────────────────────────────────────────────────────────────────

export function reducer(state: ChatRoomState, action: Action): ChatRoomState {
  switch (action.type) {
    case 'SESSION_INIT':
      return {
        ...state,
        sessionUuid: action.sessionUuid,
        sessionDetails: action.sessionDetails,
        timeLeft: action.timeLeft,
        sessionError: null,
        messages: [action.welcomeMessage],
      };
    case 'SESSION_ERROR':
      return { ...state, sessionError: action.error };
    case 'SESSION_RESET':
      return {
        ...state,
        sessionUuid: null,
        sessionDetails: null,
        timeLeft: 0,
        sessionError: null,
        messages: [],
      };
    case 'TICK':
      return { ...state, timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0 };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };
    case 'SET_INPUT':
      return { ...state, inputText: action.text };
    case 'CLEAR_INPUT':
      return { ...state, inputText: '' };
    case 'SET_MOBILE_TAB':
      return { ...state, mobileTab: action.tab };
    case 'SET_SHOW_WARNING':
      return { ...state, showWarning: action.show };
    case 'TOGGLE_TASK_OPTION': {
      const current = state.taskAnswers[action.questionKey] ?? [];
      let next: string[];
      if (action.mode === 'radio') {
        next = [action.answerKey];
      } else if (current.includes(action.answerKey)) {
        next = current.filter((o) => o !== action.answerKey);
      } else {
        next = [...current, action.answerKey];
      }
      return { ...state, taskAnswers: { ...state.taskAnswers, [action.questionKey]: next } };
    }
    default:
      return state;
  }
}
