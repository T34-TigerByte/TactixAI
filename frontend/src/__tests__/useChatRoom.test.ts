import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatRoom } from '../hooks/useChatRoom';
import { useScenario } from '../hooks/useScenario';
import { startSessionRequest, getSessionRequest } from '../api/learner.api';
import { getToken } from '../utils/auth.utils';
import type { LearnerScenario, SessionDetails } from '../schemas/api.schema';

// ── Mocks ─────────────────────────────────────────────────────────────────────

// __esModule: true prevents __importStar from adding an extra default wrapper,
// keeping the Rolldown double-wrap structure: _ws.default.default = actual hook
jest.mock('react-use-websocket', () => ({
  __esModule: true,
  default: { default: jest.fn() },
  ReadyState: { UNINSTANTIATED: -1, CONNECTING: 0, OPEN: 1, CLOSING: 2, CLOSED: 3 },
}));

jest.mock('../hooks/useScenario', () => ({ useScenario: jest.fn() }));
jest.mock('../api/learner.api', () => ({
  startSessionRequest: jest.fn(),
  getSessionRequest: jest.fn(),
}));
jest.mock('../utils/auth.utils', () => ({ getToken: jest.fn() }));
jest.mock('../config', () => ({ WS_BASE_URL: 'wss://test.example.com' }));

const mockUseWebSocket = jest.requireMock('react-use-websocket').default.default as jest.Mock;
const mockUseScenario = useScenario as jest.MockedFunction<typeof useScenario>;
const mockStartSession = startSessionRequest as jest.MockedFunction<typeof startSessionRequest>;
const mockGetSession = getSessionRequest as jest.MockedFunction<typeof getSessionRequest>;
const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MOCK_SCENARIO: LearnerScenario = {
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Healthcare Data Breach',
  description: 'Ransomware on hospital records.',
  time_estimate: 40,
  threat_actor: 'RansomCrew',
};

const MOCK_SESSION_DETAILS: SessionDetails = {
  time_estimate: 40,
  system_message: 'Welcome to the training.',
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

const mockSendJsonMessage = jest.fn();

function setupWsMock(overrides: Partial<{ readyState: number; lastJsonMessage: unknown }> = {}) {
  mockUseWebSocket.mockReturnValue({
    sendJsonMessage: mockSendJsonMessage,
    lastJsonMessage: overrides.lastJsonMessage ?? null,
    readyState: overrides.readyState ?? -1,
  });
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  setupWsMock();
  mockGetToken.mockReturnValue('test-token');
  mockUseScenario.mockReturnValue({
    scenarios: [],
    hasNext: false,
    loadMore: jest.fn(),
    selectedScenario: MOCK_SCENARIO,
    setSelectedScenario: jest.fn(),
  });
  mockStartSession.mockResolvedValue({ id: 'session-uuid-123' });
  mockGetSession.mockResolvedValue(MOCK_SESSION_DETAILS);
});

afterEach(() => {
  jest.useRealTimers();
});

// ── Session initialization ────────────────────────────────────────────────────

describe('session initialization', () => {
  it('calls startSessionRequest with scenario uuid on mount', async () => {
    renderHook(() => useChatRoom());
    await waitFor(() => expect(mockStartSession).toHaveBeenCalledWith(MOCK_SCENARIO.uuid));
  });

  it('calls getSessionRequest with the returned session id', async () => {
    renderHook(() => useChatRoom());
    await waitFor(() => expect(mockGetSession).toHaveBeenCalledWith('session-uuid-123'));
  });

  it('sets sessionDetails in state after init', async () => {
    const { result } = renderHook(() => useChatRoom());
    await waitFor(() => expect(result.current.state.sessionDetails).toBe(MOCK_SESSION_DETAILS));
  });

  it('sets timeLeft from time_estimate * 60', async () => {
    const { result } = renderHook(() => useChatRoom());
    await waitFor(() => expect(result.current.state.timeLeft).toBe(40 * 60));
  });

  it('adds welcome message on session init', async () => {
    const { result } = renderHook(() => useChatRoom());
    await waitFor(() => {
      expect(result.current.state.messages).toHaveLength(1);
      expect(result.current.state.messages[0].sender).toBe('system');
      expect(result.current.state.messages[0].content).toBe('Welcome to the training.');
    });
  });

  it('does not call startSessionRequest when selectedScenario is null', () => {
    mockUseScenario.mockReturnValue({
      scenarios: [],
      hasNext: false,
      loadMore: jest.fn(),
      selectedScenario: null,
      setSelectedScenario: jest.fn(),
    });
    renderHook(() => useChatRoom());
    expect(mockStartSession).not.toHaveBeenCalled();
  });

  it('sets sessionError when startSessionRequest throws', async () => {
    mockStartSession.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useChatRoom());
    await waitFor(() => expect(result.current.state.sessionError).toBe('Failed to start session. Please try again.'));
  });

  it('sets sessionError when getSessionRequest throws', async () => {
    mockGetSession.mockRejectedValue(new Error('Server error'));
    const { result } = renderHook(() => useChatRoom());
    await waitFor(() => expect(result.current.state.sessionError).toBe('Failed to start session. Please try again.'));
  });
});

// ── handleSend ────────────────────────────────────────────────────────────────

describe('handleSend', () => {
  it('sends the message via sendJsonMessage', async () => {
    const { result } = renderHook(() => useChatRoom());
    act(() => {
      result.current.dispatch({ type: 'SET_INPUT', text: 'hello world' });
    });
    act(() => {
      result.current.handleSend();
    });
    expect(mockSendJsonMessage).toHaveBeenCalledWith({ content: 'hello world' });
  });

  it('adds a user message to state', async () => {
    const { result } = renderHook(() => useChatRoom());
    act(() => {
      result.current.dispatch({ type: 'SET_INPUT', text: 'test message' });
    });
    act(() => {
      result.current.handleSend();
    });
    const userMessages = result.current.state.messages.filter((m) => m.sender === 'user');
    expect(userMessages).toHaveLength(1);
    expect(userMessages[0].content).toBe('test message');
  });

  it('clears inputText after sending', () => {
    const { result } = renderHook(() => useChatRoom());
    act(() => {
      result.current.dispatch({ type: 'SET_INPUT', text: 'hello' });
    });
    act(() => {
      result.current.handleSend();
    });
    expect(result.current.state.inputText).toBe('');
  });

  it('does nothing when inputText is blank', () => {
    const { result } = renderHook(() => useChatRoom());
    act(() => {
      result.current.handleSend();
    });
    expect(mockSendJsonMessage).not.toHaveBeenCalled();
    expect(result.current.state.messages).toHaveLength(0);
  });

  it('does nothing when inputText is whitespace only', () => {
    const { result } = renderHook(() => useChatRoom());
    act(() => {
      result.current.dispatch({ type: 'SET_INPUT', text: '   ' });
    });
    act(() => {
      result.current.handleSend();
    });
    expect(mockSendJsonMessage).not.toHaveBeenCalled();
  });
});

// ── handleKeyDown ─────────────────────────────────────────────────────────────

describe('handleKeyDown', () => {
  it('calls handleSend on Enter key', () => {
    const { result } = renderHook(() => useChatRoom());
    act(() => {
      result.current.dispatch({ type: 'SET_INPUT', text: 'hi' });
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        shiftKey: false,
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(mockSendJsonMessage).toHaveBeenCalledWith({ content: 'hi' });
  });

  it('does not send on Shift+Enter', () => {
    const { result } = renderHook(() => useChatRoom());
    act(() => {
      result.current.dispatch({ type: 'SET_INPUT', text: 'hi' });
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'Enter',
        shiftKey: true,
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(mockSendJsonMessage).not.toHaveBeenCalled();
  });

  it('does not send on non-Enter key', () => {
    const { result } = renderHook(() => useChatRoom());
    act(() => {
      result.current.dispatch({ type: 'SET_INPUT', text: 'hi' });
    });
    act(() => {
      result.current.handleKeyDown({
        key: 'a',
        shiftKey: false,
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLInputElement>);
    });
    expect(mockSendJsonMessage).not.toHaveBeenCalled();
  });
});

// ── questions and completedCount ──────────────────────────────────────────────

describe('questions and completedCount', () => {
  it('returns empty questions before session loads', () => {
    const { result } = renderHook(() => useChatRoom());
    expect(result.current.questions).toHaveLength(0);
    expect(result.current.completedCount).toBe(0);
  });

  it('returns questions from sessionDetails after init', async () => {
    const { result } = renderHook(() => useChatRoom());
    await waitFor(() => expect(result.current.questions).toHaveLength(2));
  });

  it('completedCount increments when a task answer is selected', async () => {
    const { result } = renderHook(() => useChatRoom());
    await waitFor(() => expect(result.current.questions).toHaveLength(2));

    act(() => {
      result.current.dispatch({
        type: 'TOGGLE_TASK_OPTION',
        questionKey: 'q1',
        answerKey: 'a1',
        mode: 'radio',
      });
    });

    expect(result.current.completedCount).toBe(1);
  });

  it('completedCount reflects all answered questions', async () => {
    const { result } = renderHook(() => useChatRoom());
    await waitFor(() => expect(result.current.questions).toHaveLength(2));

    act(() => {
      result.current.dispatch({ type: 'TOGGLE_TASK_OPTION', questionKey: 'q1', answerKey: 'a1', mode: 'radio' });
      result.current.dispatch({ type: 'TOGGLE_TASK_OPTION', questionKey: 'q2', answerKey: 'b1', mode: 'radio' });
    });

    expect(result.current.completedCount).toBe(2);
  });
});

// ── Timer ─────────────────────────────────────────────────────────────────────

describe('timer', () => {
  it('decrements timeLeft every second', async () => {
    const { result } = renderHook(() => useChatRoom());
    await waitFor(() => expect(result.current.state.timeLeft).toBe(2400));

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.state.timeLeft).toBe(2397);
  });
});

// ── WebSocket auth ────────────────────────────────────────────────────────────

describe('WebSocket auth', () => {
  it('sends auth message when readyState becomes OPEN', async () => {
    setupWsMock({ readyState: 1 }); // OPEN
    renderHook(() => useChatRoom());
    await waitFor(() => {
      expect(mockSendJsonMessage).toHaveBeenCalledWith({ type: 'auth', token: 'test-token' });
    });
  });

  it('does not send auth when readyState is UNINSTANTIATED', () => {
    setupWsMock({ readyState: -1 }); // UNINSTANTIATED
    renderHook(() => useChatRoom());
    expect(mockSendJsonMessage).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'auth' }));
  });
});

// ── Incoming WebSocket message ────────────────────────────────────────────────

describe('incoming WebSocket message', () => {
  it('adds a system message when lastJsonMessage updates', async () => {
    const { result, rerender } = renderHook(() => useChatRoom());

    setupWsMock({ lastJsonMessage: { content: 'Hello from server' } });
    rerender();

    await waitFor(() => {
      const systemMessages = result.current.state.messages.filter((m) => m.sender === 'system');
      expect(systemMessages.some((m) => m.content === 'Hello from server')).toBe(true);
    });
  });

  it('does not add a message when lastJsonMessage is null', () => {
    const { result } = renderHook(() => useChatRoom());
    const initialCount = result.current.state.messages.length;
    expect(result.current.state.messages.length).toBe(initialCount);
  });
});
