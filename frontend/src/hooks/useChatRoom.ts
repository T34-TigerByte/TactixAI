import { useReducer, useEffect, useRef, useMemo, useState } from 'react';
import * as _ws from 'react-use-websocket';
// Rolldown (Vite 8) double-wraps CJS modules: _ws.default = exports object, _ws.default.default = actual hook
const _wsInner = _ws.default as unknown as typeof _ws;
const useWebSocket = _wsInner.default as typeof _ws.default;
const { ReadyState } = _ws;
import { useScenario } from './useScenario';
import { getToken } from '../utils/auth.utils';
import { startSessionRequest, getSessionRequest } from '../api/learner.api';
import { reducer, initialState } from './chatRoomReducer';
import { WS_BASE_URL } from '../config';
import { getMockQuestions } from '../mocks/investigationQuestions.mock';
export type { Message, ChatRoomState, Action } from './chatRoomReducer';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useChatRoom() {
  const { selectedScenario: scenario } = useScenario();
  const scenarioTitle = scenario?.title ?? 'Training Session';

  const [state, dispatch] = useReducer(reducer, initialState);
  const { sessionUuid, sessionDetails, messages, inputText } = state;

  // Tracks retry attempts — incrementing this re-runs the initSession effect
  const [retryCount, setRetryCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create session and fetch session details on mount (or retry)
  useEffect(() => {
    if (!scenario?.uuid) return;
    const controller = new AbortController();

    // Timeout: if session init takes > 15s, surface an error with retry option
    const timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort();
        dispatch({ type: 'SESSION_ERROR', error: 'Connection timed out. Please try again.' });
      }
    }, 15000);

    const initSession = async () => {
      try {
        const { id } = await startSessionRequest(scenario.uuid);
        if (controller.signal.aborted) { clearTimeout(timeoutId); return; }
        const details = await getSessionRequest(id);
        clearTimeout(timeoutId);
        if (controller.signal.aborted) return;
        dispatch({
          type: 'SESSION_INIT',
          sessionUuid: id,
          sessionDetails: details,
          timeLeft: details.time_estimate * 60,
          welcomeMessage: {
            id: '1',
            sender: 'system',
            content: details.system_message ?? `Welcome to the "${scenarioTitle}" training scenario. Stay calm and apply your training.`,
            timestamp: makeTimestamp(),
          },
        });
      } catch {
        clearTimeout(timeoutId);
        if (!controller.signal.aborted) {
          dispatch({ type: 'SESSION_ERROR', error: 'Failed to start session. Please try again.' });
        }
      }
    };
    initSession();
    return () => { controller.abort(); clearTimeout(timeoutId); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.uuid, retryCount]);

  // Retry: reset state and re-run initSession
  const retrySession = () => {
    dispatch({ type: 'SESSION_RESET' });
    setRetryCount((c) => c + 1);
  };

  // Stable options reference — prevents react-use-websocket from reconnecting on every TICK re-render
  const wsOptions = useMemo(() => ({
    shouldReconnect: (event: CloseEvent) => event.code !== 4001,
    reconnectAttempts: 20,
    reconnectInterval: 2000,
  }), []);

  // null URL = no connection until sessionUuid is ready (safer than connect boolean)
  const wsUrl = sessionUuid ? `${WS_BASE_URL}/ws/${sessionUuid}` : null;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(wsUrl, wsOptions);

  // Send auth token as first message once connection opens
  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return;
    sendJsonMessage({ type: 'auth', token: getToken() });
  }, [readyState, sendJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage === null) return;
    const data = lastJsonMessage as { content: string };
    dispatch({
      type: 'ADD_MESSAGE',
      message: { id: Date.now().toString(), sender: 'ai_model', content: data.content, timestamp: makeTimestamp() },
    });
  }, [lastJsonMessage]);

  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    sendJsonMessage({ content: text });
    dispatch({ type: 'ADD_MESSAGE', message: { id: Date.now().toString(), sender: 'user', content: text, timestamp: makeTimestamp() } });
    dispatch({ type: 'CLEAR_INPUT' });
    dispatch({ type: 'SET_TYPING', isTyping: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const apiQuestions = sessionDetails?.questions ?? [];
  const questions = apiQuestions.length > 0 ? apiQuestions : getMockQuestions(scenario?.title ?? '');
  const completedCount = questions.filter((q) => (state.taskAnswers[q.question_key] ?? []).length > 0).length;

  return {
    scenario,
    state,
    dispatch,
    retrySession,
    messagesEndRef,
    handleSend,
    handleKeyDown,
    questions,
    completedCount,
  };
}
