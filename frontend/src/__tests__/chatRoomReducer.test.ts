import { reducer, initialState } from '../hooks/chatRoomReducer';
import type { ChatRoomState, Action } from '../hooks/chatRoomReducer';
import type { SessionDetails } from '../schemas/api.schema';

const MOCK_SESSION_DETAILS: SessionDetails = {
  time_estimate: 40,
  system_message: 'Welcome to the scenario.',
  questions: [
    {
      title: 'What is the threat actor motivation?',
      question_key: 'q1',
      options: [
        { title: 'Financial gain', answer_key: 'a1' },
        { title: 'Espionage', answer_key: 'a2' },
      ],
    },
    {
      title: 'Which data was targeted?',
      question_key: 'q2',
      options: [
        { title: 'PII', answer_key: 'b1' },
        { title: 'Trade secrets', answer_key: 'b2' },
      ],
    },
  ],
};

const WELCOME_MESSAGE = {
  id: '1',
  sender: 'system' as const,
  content: 'Welcome to the scenario.',
  timestamp: '08:00 AM',
};

// ── SESSION_INIT ──────────────────────────────────────────────────────────────

describe('SESSION_INIT', () => {
  it('sets sessionUuid and sessionDetails', () => {
    const action: Action = {
      type: 'SESSION_INIT',
      sessionUuid: 'uuid-123',
      sessionDetails: MOCK_SESSION_DETAILS,
      timeLeft: 2400,
      welcomeMessage: WELCOME_MESSAGE,
    };
    const next = reducer(initialState, action);

    expect(next.sessionUuid).toBe('uuid-123');
    expect(next.sessionDetails).toBe(MOCK_SESSION_DETAILS);
  });

  it('sets timeLeft from action payload', () => {
    const action: Action = {
      type: 'SESSION_INIT',
      sessionUuid: 'uuid-123',
      sessionDetails: MOCK_SESSION_DETAILS,
      timeLeft: 2400,
      welcomeMessage: WELCOME_MESSAGE,
    };
    expect(reducer(initialState, action).timeLeft).toBe(2400);
  });

  it('replaces messages with only the welcome message', () => {
    const stateWithMessages: ChatRoomState = {
      ...initialState,
      messages: [
        { id: 'old', sender: 'user', content: 'hi', timestamp: '07:00 AM' },
      ],
    };
    const action: Action = {
      type: 'SESSION_INIT',
      sessionUuid: 'uuid-123',
      sessionDetails: MOCK_SESSION_DETAILS,
      timeLeft: 2400,
      welcomeMessage: WELCOME_MESSAGE,
    };
    const next = reducer(stateWithMessages, action);
    expect(next.messages).toHaveLength(1);
    expect(next.messages[0]).toBe(WELCOME_MESSAGE);
  });
});

// ── TICK ──────────────────────────────────────────────────────────────────────

describe('TICK', () => {
  it('decrements timeLeft by 1', () => {
    const state: ChatRoomState = { ...initialState, timeLeft: 60 };
    expect(reducer(state, { type: 'TICK' }).timeLeft).toBe(59);
  });

  it('does not go below 0', () => {
    const state: ChatRoomState = { ...initialState, timeLeft: 0 };
    expect(reducer(state, { type: 'TICK' }).timeLeft).toBe(0);
  });

  it('stops at 0 when timeLeft is 1', () => {
    const state: ChatRoomState = { ...initialState, timeLeft: 1 };
    expect(reducer(state, { type: 'TICK' }).timeLeft).toBe(0);
  });
});

// ── ADD_MESSAGE ───────────────────────────────────────────────────────────────

describe('ADD_MESSAGE', () => {
  const newMessage = { id: '2', sender: 'user' as const, content: 'Hello', timestamp: '09:00 AM' };

  it('appends message to empty list', () => {
    const next = reducer(initialState, { type: 'ADD_MESSAGE', message: newMessage });
    expect(next.messages).toHaveLength(1);
    expect(next.messages[0]).toBe(newMessage);
  });

  it('appends message to existing list', () => {
    const state: ChatRoomState = { ...initialState, messages: [WELCOME_MESSAGE] };
    const next = reducer(state, { type: 'ADD_MESSAGE', message: newMessage });
    expect(next.messages).toHaveLength(2);
    expect(next.messages[1]).toBe(newMessage);
  });

  it('does not mutate the previous messages array', () => {
    const state: ChatRoomState = { ...initialState, messages: [WELCOME_MESSAGE] };
    const next = reducer(state, { type: 'ADD_MESSAGE', message: newMessage });
    expect(next.messages).not.toBe(state.messages);
  });
});

// ── SET_TYPING ────────────────────────────────────────────────────────────────

describe('SET_TYPING', () => {
  it('sets isTyping to true', () => {
    expect(reducer(initialState, { type: 'SET_TYPING', isTyping: true }).isTyping).toBe(true);
  });

  it('sets isTyping to false', () => {
    const state: ChatRoomState = { ...initialState, isTyping: true };
    expect(reducer(state, { type: 'SET_TYPING', isTyping: false }).isTyping).toBe(false);
  });
});

describe('ADD_MESSAGE clears isTyping', () => {
  it('resets isTyping to false when a message is added', () => {
    const state: ChatRoomState = { ...initialState, isTyping: true };
    const next = reducer(state, {
      type: 'ADD_MESSAGE',
      message: { id: '2', sender: 'ai_model', content: 'Response', timestamp: '09:01 AM' },
    });
    expect(next.isTyping).toBe(false);
  });
});

// ── SET_INPUT / CLEAR_INPUT ───────────────────────────────────────────────────

describe('SET_INPUT', () => {
  it('updates inputText', () => {
    const next = reducer(initialState, { type: 'SET_INPUT', text: 'Hello world' });
    expect(next.inputText).toBe('Hello world');
  });

  it('allows empty string', () => {
    const state: ChatRoomState = { ...initialState, inputText: 'something' };
    expect(reducer(state, { type: 'SET_INPUT', text: '' }).inputText).toBe('');
  });
});

describe('CLEAR_INPUT', () => {
  it('resets inputText to empty string', () => {
    const state: ChatRoomState = { ...initialState, inputText: 'typed text' };
    expect(reducer(state, { type: 'CLEAR_INPUT' }).inputText).toBe('');
  });
});

// ── SET_MOBILE_TAB ────────────────────────────────────────────────────────────

describe('SET_MOBILE_TAB', () => {
  it('switches to tasks tab', () => {
    const next = reducer(initialState, { type: 'SET_MOBILE_TAB', tab: 'tasks' });
    expect(next.mobileTab).toBe('tasks');
  });

  it('switches back to chat tab', () => {
    const state: ChatRoomState = { ...initialState, mobileTab: 'tasks' };
    expect(reducer(state, { type: 'SET_MOBILE_TAB', tab: 'chat' }).mobileTab).toBe('chat');
  });
});

// ── SET_SHOW_WARNING ──────────────────────────────────────────────────────────

describe('SET_SHOW_WARNING', () => {
  it('sets showWarning to true', () => {
    expect(reducer(initialState, { type: 'SET_SHOW_WARNING', show: true }).showWarning).toBe(true);
  });

  it('sets showWarning to false', () => {
    const state: ChatRoomState = { ...initialState, showWarning: true };
    expect(reducer(state, { type: 'SET_SHOW_WARNING', show: false }).showWarning).toBe(false);
  });
});

// ── TOGGLE_TASK_OPTION ────────────────────────────────────────────────────────

describe('TOGGLE_TASK_OPTION — radio', () => {
  it('selects an option when none was selected', () => {
    const next = reducer(initialState, {
      type: 'TOGGLE_TASK_OPTION',
      questionKey: 'q1',
      answerKey: 'a1',
      mode: 'radio',
    });
    expect(next.taskAnswers['q1']).toEqual(['a1']);
  });

  it('replaces existing radio selection', () => {
    const state: ChatRoomState = { ...initialState, taskAnswers: { q1: ['a1'] } };
    const next = reducer(state, {
      type: 'TOGGLE_TASK_OPTION',
      questionKey: 'q1',
      answerKey: 'a2',
      mode: 'radio',
    });
    expect(next.taskAnswers['q1']).toEqual(['a2']);
  });

  it('does not affect other questions', () => {
    const state: ChatRoomState = { ...initialState, taskAnswers: { q2: ['b1'] } };
    const next = reducer(state, {
      type: 'TOGGLE_TASK_OPTION',
      questionKey: 'q1',
      answerKey: 'a1',
      mode: 'radio',
    });
    expect(next.taskAnswers['q2']).toEqual(['b1']);
  });
});

describe('TOGGLE_TASK_OPTION — checkbox', () => {
  it('adds an option when not yet selected', () => {
    const next = reducer(initialState, {
      type: 'TOGGLE_TASK_OPTION',
      questionKey: 'q1',
      answerKey: 'a1',
      mode: 'checkbox',
    });
    expect(next.taskAnswers['q1']).toContain('a1');
  });

  it('removes an option when already selected', () => {
    const state: ChatRoomState = { ...initialState, taskAnswers: { q1: ['a1', 'a2'] } };
    const next = reducer(state, {
      type: 'TOGGLE_TASK_OPTION',
      questionKey: 'q1',
      answerKey: 'a1',
      mode: 'checkbox',
    });
    expect(next.taskAnswers['q1']).not.toContain('a1');
    expect(next.taskAnswers['q1']).toContain('a2');
  });

  it('can accumulate multiple selections', () => {
    let state = reducer(initialState, {
      type: 'TOGGLE_TASK_OPTION', questionKey: 'q1', answerKey: 'a1', mode: 'checkbox',
    });
    state = reducer(state, {
      type: 'TOGGLE_TASK_OPTION', questionKey: 'q1', answerKey: 'a2', mode: 'checkbox',
    });
    expect(state.taskAnswers['q1']).toEqual(['a1', 'a2']);
  });
});

// ── SESSION_RESET ─────────────────────────────────────────────────────────────

describe('SESSION_RESET', () => {
  it('clears session fields and messages', () => {
    const state: ChatRoomState = {
      ...initialState,
      sessionUuid: 'uuid-123',
      sessionDetails: MOCK_SESSION_DETAILS,
      timeLeft: 1200,
      sessionError: 'some error',
      messages: [WELCOME_MESSAGE],
    };
    const next = reducer(state, { type: 'SESSION_RESET' });
    expect(next.sessionUuid).toBeNull();
    expect(next.sessionDetails).toBeNull();
    expect(next.timeLeft).toBe(0);
    expect(next.sessionError).toBeNull();
    expect(next.messages).toHaveLength(0);
  });

  it('preserves mobileTab and taskAnswers', () => {
    const state: ChatRoomState = {
      ...initialState,
      mobileTab: 'tasks',
      taskAnswers: { q1: ['a1'] },
      sessionError: 'error',
    };
    const next = reducer(state, { type: 'SESSION_RESET' });
    expect(next.mobileTab).toBe('tasks');
    expect(next.taskAnswers).toEqual({ q1: ['a1'] });
  });
});

// ── Immutability ──────────────────────────────────────────────────────────────

describe('immutability', () => {
  it('returns a new state object on every action', () => {
    const next = reducer(initialState, { type: 'TICK' });
    expect(next).not.toBe(initialState);
  });

  it('does not mutate taskAnswers reference on TOGGLE', () => {
    const state: ChatRoomState = { ...initialState, taskAnswers: { q1: ['a1'] } };
    const next = reducer(state, {
      type: 'TOGGLE_TASK_OPTION', questionKey: 'q1', answerKey: 'a2', mode: 'radio',
    });
    expect(next.taskAnswers).not.toBe(state.taskAnswers);
  });
});
