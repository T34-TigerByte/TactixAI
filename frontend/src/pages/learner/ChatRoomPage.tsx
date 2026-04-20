import { useNavigate } from 'react-router-dom';
import { Send, Clock, MessageSquare, ClipboardList } from 'lucide-react';
import DashboardHeader from '../../components/ui/DashboardHeader.tsx';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import WarningModal from '../../components/ui/WarningModal.tsx';
import { useChatRoom } from '../../hooks/useChatRoom';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { scenario, state, dispatch, retrySession, messagesEndRef, handleSend, handleKeyDown, questions, completedCount } = useChatRoom();

  const { timeLeft, messages, inputText, showWarning, mobileTab, taskAnswers, sessionError, sessionDetails } = state;
  const scenarioTitle = scenario?.title ?? 'Training Session';
  const threatActorName = scenario?.threat_actor ?? 'Negotiator';
  const isSessionLoading = !sessionDetails && !sessionError;

  if (sessionError) {
    return (
      <div className='h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-gray-100 flex flex-col overflow-hidden'>
        <DashboardHeader
          title={scenarioTitle}
          subtitle=''
          onBack={() => navigate(ROUTES.LEARNER.SCENARIOS)}
          onLogout={() => { logout(); navigate(ROUTES.LOGIN, { replace: true }); }}
        />
        <div className='flex-1 flex items-center justify-center p-8'>
          <div className='bg-white rounded-xl border border-red-200 shadow-sm p-8 max-w-md w-full text-center space-y-4'>
            <p className='text-red-600 font-semibold text-base'>{sessionError}</p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <button
                onClick={retrySession}
                className='px-6 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors cursor-pointer'
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(ROUTES.LEARNER.SCENARIOS)}
                className='px-6 py-2.5 rounded-lg bg-[#0f1c35] hover:bg-[#1a2f52] text-white text-sm font-semibold transition-colors cursor-pointer'
              >
                Back to Scenarios
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] bg-gray-100 flex flex-col overflow-hidden'>
      <DashboardHeader
        title={scenarioTitle}
        subtitle={`Threat Actor: ${threatActorName}`}
        onBack={() => dispatch({ type: 'SET_SHOW_WARNING', show: true })}
        onLogout={() => { logout(); navigate(ROUTES.LOGIN, { replace: true }); }}
      />

      {/* Mobile tab switcher */}
      <div className='lg:hidden max-w-7xl w-full mx-auto px-4 sm:px-8 pt-4 flex gap-2'>
        <button
          onClick={() => dispatch({ type: 'SET_MOBILE_TAB', tab: 'chat' })}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${mobileTab === 'chat' ? 'bg-[#0f1c35] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          Negotiation Chat
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_MOBILE_TAB', tab: 'tasks' })}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${mobileTab === 'tasks' ? 'bg-[#0f1c35] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          Investigation Tasks {completedCount > 0 && `(${completedCount}/${questions.length})`}
        </button>
      </div>

      <main className='flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-4 lg:py-6 flex gap-6 min-h-0'>
        {/* Left: Chat Panel */}
        <div className={`flex-1 min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm flex-col ${mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
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
                onClick={() => dispatch({ type: 'SET_SHOW_WARNING', show: true })}
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
            {isSessionLoading && (
              <div className='flex items-center justify-center h-full'>
                <div className='flex flex-col items-center gap-3 text-gray-400'>
                  <div className='w-6 h-6 border-2 border-gray-300 border-t-orange-400 rounded-full animate-spin' />
                  <p className='text-sm'>Connecting to session...</p>
                </div>
              </div>
            )}
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
              onChange={(e) => dispatch({ type: 'SET_INPUT', text: e.target.value })}
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
        <div className={`w-full lg:w-80 xl:w-96 min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm flex-col ${mobileTab === 'tasks' ? 'flex' : 'hidden lg:flex'}`}>
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
                      <span className='text-teal-500 text-sm mt-0.5 shrink-0'>✓</span>
                    ) : (
                      <span className='text-gray-300 text-sm mt-0.5 shrink-0'>○</span>
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
                          onChange={() => dispatch({ type: 'TOGGLE_TASK_OPTION', questionKey: task.question_key, answerKey: opt.answer_key, mode: 'radio' })}
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
          onCancel={() => dispatch({ type: 'SET_SHOW_WARNING', show: false })}
        />
      )}
    </div>
  );
}
