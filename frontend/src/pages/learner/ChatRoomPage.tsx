import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Clock, MessageSquare, ClipboardList } from 'lucide-react';
import DashboardHeader from '../../components/ui/DashboardHeader.tsx';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import WarningModal from '../../components/ui/WarningModal.tsx';
import * as _ws from 'react-use-websocket';
// Rolldown (Vite 8) double-wraps CJS modules: _ws.default = exports object, _ws.default.default = actual hook
const _wsInner = _ws.default as unknown as typeof _ws;
const useWebSocket = _wsInner.default as typeof _ws.default;
const { ReadyState } = _ws;
import { useScenario } from '../../hooks/useScenario';
import { getToken } from '../../utils/auth.utils';
import { startSessionRequest, getSessionRequest } from '../../api/learner.api';
import type { SessionDetails } from '../../schemas/api.schema';

interface Message {
  id: string;
  sender: 'system' | 'user';
  content: string;
  timestamp: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { selectedScenario: scenario } = useScenario();
  const { logout } = useAuth();

  const scenarioTitle: string = scenario?.title ?? 'Training Session';
  const threatActorName: string = scenario?.threat_actor ?? 'Negotiator';

  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [sessionUuid, setSessionUuid] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [inputText, setInputText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [taskAnswers, setTaskAnswers] = useState<Record<string, string[]>>({});
  const [mobileTab, setMobileTab] = useState<'chat' | 'tasks'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create session and fetch session details on mount
  useEffect(() => {
    if (!scenario?.uuid) return;
    const initSession = async () => {
      const { id } = await startSessionRequest(scenario.uuid);
      const details = await getSessionRequest(id);
      setSessionUuid(id); 
      setSessionDetails(details);
      setTimeLeft(details.time_estimate * 60);
      setMessages([{
        id: '1',
        sender: 'system',
        content: details.system_message ?? `Welcome to the "${scenarioTitle}" training scenario. Stay calm and apply your training.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    };
    initSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.uuid]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    `${import.meta.env.VITE_PROD_WS_BASE_URL}/ws/${sessionUuid ?? ''}`,
    {
      onClose: () => console.log('WebSocket connection closed'),
      shouldReconnect: (event) => event.code !== 4001,
    },
    !!sessionUuid,
  );

  // Send auth token as first message once connection opens
  useEffect(() => {
    if (readyState !== ReadyState.OPEN) return;
    sendJsonMessage({ type: 'auth', token: getToken() });
  }, [readyState, sendJsonMessage]);

  useEffect(() => {
    if (lastJsonMessage === null) return;
    const data = lastJsonMessage as { content: string };
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'system',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [lastJsonMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    sendJsonMessage({ content: text });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleOption = (taskId: string, option: string, type: 'radio' | 'checkbox') => {
    setTaskAnswers((prev) => {
      const current = prev[taskId] ?? [];
      if (type === 'radio') return { ...prev, [taskId]: [option] };
      if (current.includes(option)) return { ...prev, [taskId]: current.filter((o) => o !== option) };
      return { ...prev, [taskId]: [...current, option] };
    });
  };

  const questions = sessionDetails?.questions ?? [];
  const completedCount = questions.filter((q) => (taskAnswers[q.question_key] ?? []).length > 0).length;

  const handleBack = () => { 
    setShowWarning(true);
    if (showWarning) {
      // navigate(ROUTES.LEARNER.SCENARIOS);
    }
  };
  const handleLogout = () => { logout(); navigate(ROUTES.LOGIN, { replace: true }); };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col'>
      <DashboardHeader
        title={scenarioTitle}
        subtitle={`Threat Actor: ${threatActorName}`}
        onBack={handleBack}
        onLogout={handleLogout}
      />

      {/* Mobile tab switcher */}
      <div className='lg:hidden max-w-7xl w-full mx-auto px-4 sm:px-8 pt-4 flex gap-2'>
        <button
          onClick={() => setMobileTab('chat')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${mobileTab === 'chat' ? 'bg-[#0f1c35] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          Negotiation Chat
        </button>
        <button
          onClick={() => setMobileTab('tasks')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${mobileTab === 'tasks' ? 'bg-[#0f1c35] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          Investigation Tasks {completedCount > 0 && `(${completedCount}/${questions.length})`}
        </button>
      </div>

      <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-4 lg:py-6 flex gap-6 min-h-0'>
        {/* Left: Chat Panel */}
        <div className={`flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex-col ${mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Chat header */}
          <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0'>
            <div className='flex items-center gap-2 text-gray-700 font-semibold text-sm'>
              <MessageSquare className='w-4 h-4' />
              Negotiation Chat
            </div>
            <div className='flex items-center gap-3'>
              <div className='flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 text-white text-sm font-mono font-semibold'>
                <Clock className='w-3.5 h-3.5' />
                {formatTime(timeLeft)}
              </div>
              <button
                onClick={handleBack}
                className='px-4 py-1.5 rounded bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors cursor-pointer'
              >
                End Session
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className='mx-5 mt-4 px-4 py-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 text-xs leading-relaxed shrink-0'>
            Disclaimer: This is a simulated training environment. All scenarios,
            threat actors, and negotiations are fictional and designed for
            educational purposes only.
          </div>

          {/* Messages */}
          <div className='flex-1 overflow-y-auto px-5 py-4 space-y-4'>
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.sender === 'system' && (
                  <div className='flex items-start gap-2'>
                    <div className='w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-0.5'>
                      <span className='text-gray-500 text-xs font-bold'>S</span>
                    </div>
                    <div>
                      <span className='text-xs text-gray-400'>
                        System {msg.timestamp}
                      </span>
                      <p className='text-sm text-gray-700 mt-0.5 leading-relaxed'>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                )}
                {msg.sender === 'user' && (
                  <div className='flex justify-end'>
                    <div className='max-w-[70%] bg-orange-500 text-white rounded-xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed'>
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className='px-5 py-4 border-t border-gray-200 flex items-center gap-3 shrink-0'>
            <input
              type='text'
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Type your message...'
              className='flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent'
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className='flex items-center gap-2 px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600
                         disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold
                         transition-colors cursor-pointer'
            >
              <Send className='w-4 h-4' />
              Send
            </button>
          </div>
        </div>

        {/* Right: Investigation Tasks */}
        <div className={`w-full lg:w-80 xl:w-96 bg-white rounded-xl border border-gray-200 shadow-sm flex-col ${mobileTab === 'tasks' ? 'flex' : 'hidden lg:flex'}`}>
          {/* Tasks header */}
          <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0'>
            <div className='flex items-center gap-2 text-gray-700 font-semibold text-sm'>
              <ClipboardList className='w-4 h-4' />
              Investigation Tasks
            </div>
            <span className='text-sm font-semibold text-gray-500'>
              {completedCount}/{questions.length}
            </span>
          </div>

          {/* Tasks list */}
          <div className='flex-1 overflow-y-auto px-5 py-4 space-y-5'>
            {questions.map((task) => {
              const selected = taskAnswers[task.question_key] ?? [];
              const isDone = selected.length > 0;
              return (
                <div key={task.question_key} className='space-y-2'>
                  <div className='flex items-start gap-2'>
                    {isDone ? (
                      <span className='text-teal-500 text-sm mt-0.5 shrink-0'>
                        ✓
                      </span>
                    ) : (
                      <span className='text-gray-300 text-sm mt-0.5 shrink-0'>
                        ○
                      </span>
                    )}
                    <p className='text-sm font-semibold text-gray-800 leading-snug'>
                      {task.title}
                    </p>
                  </div>
                  <div className='pl-5 space-y-1.5'>
                    {task.options.map((opt) => (
                      <label
                        key={opt.answer_key}
                        className='flex items-start gap-2 cursor-pointer group'
                      >
                        <input
                          type='radio'
                          name={`task-${task.question_key}`}
                          checked={selected.includes(opt.answer_key)}
                          onChange={() => toggleOption(task.question_key, opt.answer_key, 'radio')}
                          className='accent-orange-500 cursor-pointer mt-0.5 shrink-0'
                        />
                        <span className='text-xs text-gray-600 group-hover:text-gray-900 transition-colors leading-relaxed'>
                          {opt.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          {showWarning && (
            <WarningModal
              title='Exit Session Confirmation'
              warning='You are about to leave this session. Please note:'
              dotpoints={[
                'You will not be able to return once you exit.',
                'All answers for the investigation tasks will be submitted automatically.',
                'Your performance will be analysed based on your current progress.',
              ]}
              finalWarning='Are you sure you want to exit?'
              onConfirm={() => navigate(ROUTES.LEARNER.SCENARIOS)}
              onCancel={() => setShowWarning(false)}
            />
          )}

          {/* Submit */}
          <div className='px-5 py-4 border-t border-gray-200 shrink-0'>
            <button
              className='w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                               border border-gray-300 hover:border-orange-400 hover:text-orange-600
                               text-gray-600 text-sm font-semibold transition-colors cursor-pointer'
            >
              <ClipboardList className='w-4 h-4' />
              Submit
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
