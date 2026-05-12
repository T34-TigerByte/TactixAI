import { useNavigate, useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { formatTimestamp, formatCurrency } from '../../utils/format.utils';

import { ROUTES } from '../../router/routes';
import DashboardHeader from '../../components/ui/DashboardHeader';
import SectionPanel from '../../components/ui/SectionPanel';
import InfoField from '../../components/ui/InfoField';
import ChatMessageBubble from '../../components/ui/ChatMessageBubble';
import BoolBadge from '../../components/ui/BoolBadge';
import { getSessionSummaryRequest, getSessionMessagesRequest, getSessionRequest } from '../../api/learner.api';

export default function ChatHistoryPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: summary } = useQuery({
    queryKey: ['session', sessionId, 'summary'],
    queryFn: () => getSessionSummaryRequest(sessionId!),
    enabled: !!sessionId,
  });

  const { data: sessionDetails } = useQuery({
    queryKey: ['session', sessionId, 'details'],
    queryFn: () => getSessionRequest(sessionId!),
    enabled: !!sessionId,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['session', sessionId, 'messages'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getSessionMessagesRequest(sessionId!, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next ? (lastPage.pagination.next_cursor ?? undefined) : undefined,
    enabled: !!sessionId,
    refetchOnWindowFocus: false,
  });

  const apiMessages = data?.pages.flatMap((p) => p.data) ?? [];
  const systemMessage = sessionDetails?.system_message
    ? [{ sender: 'system' as const, message: sessionDetails.system_message, sent_at: 0, attached_file: 'sample.doc' }]
    : [];
  const messages = [...systemMessage, ...apiMessages];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleViewReport = () => {
    navigate(ROUTES.LEARNER.PERFORMANCE.replace(':sessionId', sessionId!));
  };

  const summaryHeader = summary ? (
    <div className='bg-[#0f1c35] px-6 py-4 flex items-center justify-between'>
      <h2 className='text-white font-bold text-base'>{summary.title} Performance Summary</h2>
      <button
        className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold cursor-pointer hover:bg-orange-600 active:bg-orange-700 transition-colors'
        onClick={handleViewReport}
      >
        <Download className='w-3.5 h-3.5' />
        View Report
      </button>
    </div>
  ) : undefined;

  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader
        title='Chat History'
        subtitle={summary?.title ?? ''}
        onLogoClick={() => navigate(ROUTES.LEARNER.DASHBOARD)}
        onBack={() => navigate(ROUTES.LEARNER.PROGRESS)}
        onLogout={handleLogout}
      />

      <main className='max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6'>
        {summary && (
          <SectionPanel title='' header={summaryHeader}>
            <div className='p-6 space-y-4'>
              <div className='grid grid-cols-2 gap-6'>
                <InfoField
                  label='Start Time'
                  value={summary.start_at ? formatTimestamp(summary.start_at) : '—'}
                />
                <InfoField
                  label='End Time'
                  value={summary.end_at ? formatTimestamp(summary.end_at) : '—'}
                />
              </div>
              {summary.evaluation && (
                <div>
                  <div className='grid grid-cols-2 gap-6 py-4 border-t border-gray-100'>
                    <InfoField
                      label='Initial Ransom Amount'
                      value={
                        summary.evaluation.initial_ransom_amount !== null
                          ? formatCurrency(summary.evaluation.initial_ransom_amount)
                          : '—'
                      }
                    />
                    <InfoField
                      label='Final Ransom Amount'
                      value={
                        summary.evaluation.final_ransom_amount !== null
                          ? formatCurrency(summary.evaluation.final_ransom_amount)
                          : '—'
                      }
                    />
                  </div>
                  <div className='border-t border-gray-100 pt-4'>
                    <p className='text-xs text-gray-400 mb-1'>Session Goals Achieved</p>
                    <div className='grid grid-cols-4 gap-6'>
                      <BoolBadge label='Time Extended' value={summary.evaluation.time_extended} />
                      <BoolBadge label='Ransom Reduced' value={summary.evaluation.ransom_reduced} />
                      <BoolBadge label='Decryption Key Requested' value={summary.evaluation.decryption_key_requested} />
                      <BoolBadge label='Data Exploitation Discussed' value={summary.evaluation.data_exploitation_discussed} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SectionPanel>
        )}

        <SectionPanel title='Conversation History'>
          <div className='mx-4 mt-4 px-4 py-3 rounded-lg bg-gray-50 border border-gray-200'>
            <p className='text-xs text-gray-500'>
              <span className='font-semibold'>Reference Demo:</span> This is a completed training
              session for learning purposes. Review the negotiation strategies, communication
              techniques, and documentation practices demonstrated in this conversation.
            </p>
          </div>

          <div className='p-4 space-y-3'>
            {messages.length === 0 ? (
              <p className='text-center text-gray-400 text-sm py-8'>No messages.</p>
            ) : (
              messages.map((msg, i) => (
                <ChatMessageBubble
                  key={i}
                  sender={msg.sender}
                  content={msg.message}
                  timestamp={msg.sent_at > 0 ? formatTimestamp(msg.sent_at) : undefined}
                  variant='history'
                  attachedFile={msg.attached_file}
                />
              ))
            )}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className='w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50'
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        </SectionPanel>

        {(summary?.investigation_tasks?.length ?? 0) > 0 && (
          <SectionPanel title='Investigation Tasks'>
            <div className='p-6 space-y-3'>
              {summary!.investigation_tasks.map((task, i) => (
                <div key={i} className='space-y-1'>
                  <p className='text-sm font-medium text-gray-700'>{task.question}</p>
                  <p className='text-sm text-gray-500'>{task.answer ?? '—'}</p>
                </div>
              ))}
            </div>
          </SectionPanel>
        )}
      </main>
    </div>
  );
}
