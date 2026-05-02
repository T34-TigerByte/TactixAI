import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { CheckCircle2, XCircle } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';
import DashboardHeader from '../../components/ui/DashboardHeader';
import SectionPanel from '../../components/ui/SectionPanel';
import InfoField from '../../components/ui/InfoField';
import ChatMessageBubble from '../../components/ui/ChatMessageBubble';
import {
  getAdminSessionSummaryRequest,
  getAdminSessionMessagesRequest,
} from '../../api/admin.api';
import type { AdminUserListItem } from '../../schemas/api.schema';

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

function BoolBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <div className='flex items-center gap-1.5'>
      {value ? (
        <CheckCircle2 className='w-4 h-4 text-teal-500 shrink-0' />
      ) : (
        <XCircle className='w-4 h-4 text-gray-300 shrink-0' />
      )}
      <span className={`text-sm ${value ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}

export default function AdminChatHistoryPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = state?.user as AdminUserListItem | undefined;

  const { data: summary } = useQuery({
    queryKey: ['admin', 'session', sessionId, 'summary'],
    queryFn: () => getAdminSessionSummaryRequest(sessionId!),
    enabled: !!sessionId,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['admin', 'session', sessionId, 'messages'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getAdminSessionMessagesRequest(sessionId!, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.next_cursor ?? undefined,
    enabled: !!sessionId,
  });

  const messages = data?.pages.flatMap((p) => p.data) ?? [];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleBack = () => navigate(-1);

  const summaryHeader = summary ? (
    <div className='bg-[#0f1c35] px-6 py-4'>
      <h2 className='text-white font-bold text-base'>{summary.title} — Performance Summary</h2>
    </div>
  ) : undefined;

  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader
        title='Chat History'
        subtitle={summary?.title ?? state?.sessionTitle ?? ''}
        onLogoClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
        onBack={handleBack}
        onLogout={handleLogout}
      />

      <main className='max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-6'>
        {/* Learner context banner */}
        {user && (
          <div className='px-4 py-2.5 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-700'>
            Viewing session for <span className='font-semibold'>{user.email}</span>
          </div>
        )}

        {/* Performance Summary */}
        {summary && (
          <SectionPanel title='' header={summaryHeader}>
            <div className='p-6 space-y-5'>
              {/* Timing */}
              <div className='grid grid-cols-2 gap-6'>
                <InfoField label='Start Time' value={summary.start_at ? formatTimestamp(summary.start_at) : '—'} />
                <InfoField label='End Time' value={summary.end_at ? formatTimestamp(summary.end_at) : '—'} />
              </div>

              {summary.evaluation && (
                <>
                  {/* Ransom amounts */}
                  <div className='grid grid-cols-2 gap-6 pt-4 border-t border-gray-100'>
                    <InfoField
                      label='Initial Ransom'
                      value={
                        summary.evaluation.initial_ransom_amount != null
                          ? formatCurrency(summary.evaluation.initial_ransom_amount)
                          : '—'
                      }
                    />
                    <InfoField
                      label='Final Ransom'
                      value={
                        summary.evaluation.final_ransom_amount != null
                          ? formatCurrency(summary.evaluation.final_ransom_amount)
                          : '—'
                      }
                    />
                  </div>

                  {/* Boolean flags */}
                  <div className='grid grid-cols-2 gap-3 pt-4 border-t border-gray-100'>
                    <BoolBadge label='Time Extended' value={summary.evaluation.time_extended} />
                    <BoolBadge label='Ransom Reduced' value={summary.evaluation.ransom_reduced} />
                    <BoolBadge label='Decryption Key Requested' value={summary.evaluation.decryption_key_requested} />
                    <BoolBadge label='Data Exploitation Discussed' value={summary.evaluation.data_exploitation_discussed} />
                  </div>
                </>
              )}

              {/* Investigation tasks */}
              {(summary.investigation_tasks?.length ?? 0) > 0 && (
                <div className='pt-4 border-t border-gray-100 space-y-3'>
                  <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>Investigation Tasks</p>
                  {summary.investigation_tasks?.map((task, i) => (
                    <div key={i} className='space-y-1'>
                      <p className='text-sm font-medium text-gray-700'>{task.question}</p>
                      <p className='text-sm text-gray-500'>{task.answer ?? '—'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionPanel>
        )}

        {/* Conversation */}
        <SectionPanel title='Conversation History'>
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
      </main>
    </div>
  );
}
