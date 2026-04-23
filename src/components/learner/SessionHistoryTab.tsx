import { useNavigate } from 'react-router-dom';
import { MessageSquare, Eye, Download } from 'lucide-react';

import { ROUTES } from '../../router/routes';
import SectionPanel from '../ui/SectionPanel';
import ActionListItem from '../ui/ActionListItem';
import type { SessionListItem } from '../../schemas/api.schema';

function formatSessionDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}

interface Props {
  sessions: SessionListItem[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export default function SessionHistoryTab({ sessions, hasNextPage, isFetchingNextPage, fetchNextPage }: Props) {
  const navigate = useNavigate();

  return (
    <SectionPanel icon={<MessageSquare className='w-5 h-5' />} title='Completed Training Sessions'>
      <div className='divide-y divide-gray-100'>
        {sessions.length === 0 ? (
          <p className='text-center text-gray-400 text-sm py-12'>No sessions yet.</p>
        ) : (
          sessions.map((session) => (
            <ActionListItem
              key={session.uuid}
              title={session.title}
              subtitle={session.end_at ? formatSessionDate(session.end_at) : 'In Progress'}
              actions={
                <>
                  <button
                    onClick={() => navigate(ROUTES.LEARNER.SESSION_HISTORY.replace(':sessionId', session.uuid))}
                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500 text-orange-500 text-xs font-semibold hover:bg-orange-50 transition-colors cursor-pointer'
                  >
                    <Eye className='w-3.5 h-3.5' />
                    View Chat
                  </button>
                  <button
                    disabled
                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold opacity-50 cursor-not-allowed'
                  >
                    <Download className='w-3.5 h-3.5' />
                    Export Report
                  </button>
                </>
              }
            />
          ))
        )}
      </div>
      {hasNextPage && (
        <div className='p-4 border-t border-gray-100'>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className='w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50'
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </SectionPanel>
  );
}
