import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { MessageSquare, Clock } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';
import DashboardHeader from '../../components/ui/DashboardHeader';
import StatsCard from '../../components/ui/StatsCard';
import ScenarioProgressPanel from '../../components/ui/ScenarioProgressPanel';
import TabNav from '../../components/ui/TabNav';
import { getLearnerStatsRequest, getSessionsRequest } from '../../api/learner.api';
import SessionHistoryTab from '../../components/learner/SessionHistoryTab';

type Tab = 'history' | 'skills';

const TABS: { key: Tab; label: string }[] = [
  { key: 'history', label: 'Session History' },
  { key: 'skills', label: 'Skill Progress' },
];

export default function TrackProgressPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('history');

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const { data: learnerStats } = useQuery({
    queryKey: ['learner', 'stats'],
    queryFn: getLearnerStatsRequest,
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['learner', 'sessions', 'all'],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => getSessionsRequest(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.next_cursor ?? undefined,
  });
  
  const sessions = data?.pages.flatMap((p) => p.data).sort((a, b) => (b.end_at || 0) - (a.end_at || 0)) ?? [];

  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader
        title='Progress Track'
        subtitle='Your training history and skill development'
        onLogoClick={() => navigate(ROUTES.LEARNER.DASHBOARD)}
        onBack={() => navigate(ROUTES.LEARNER.DASHBOARD)}
        onLogout={handleLogout}
      />

      <main className='max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <StatsCard
            label='Total Sessions'
            value={learnerStats?.session.total ?? '—'}
            icon={<MessageSquare className='w-5 h-5 text-teal-500' />}
          />
          <StatsCard
            label='Training Hours'
            value={learnerStats ? `${learnerStats.session.total_hours}h` : '—'}
            icon={<Clock className='w-5 h-5 text-purple-500' />}
          />
        </div>

        <TabNav tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'history' && (
          <SessionHistoryTab
            sessions={sessions}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}

        {activeTab === 'skills' && learnerStats?.progress && (
          <ScenarioProgressPanel progress={learnerStats.progress} />
        )}
      </main>
    </div>
  );
}
