import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Users, UserCheck, BarChart2 } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';

import OverviewTab from '../../components/admin/OverviewTab';
import UsersTab from '../../components/admin/UsersTab';
import AnalyticsTab from '../../components/admin/AnalyticsTab';
import StatsCard from '../../components/ui/StatsCard';
import DashboardHeader from '../../components/ui/DashboardHeader';
import TabNav from '../../components/ui/TabNav';
import { getAdminStatsRequest } from '../../api/admin.api';
import type { AdminTab } from '../../types/admin.types';

// MOCK DATA
// TODO: replace with API calls when backend is ready

const MOCK_STATS = {
  totalUsers: 247,
  userGrowth: 12.5,
  activeLearners: 156,
  totalSessions: 1847,
  avgScore: 76,
  uptime: 99.8,
};

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get('tab') as AdminTab) ?? 'overview';
  const setActiveTab = (tab: AdminTab) => setSearchParams({ tab });

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const TABS: { key: AdminTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'User Management' },
    { key: 'analytics', label: 'Analytics' },
  ];

  useEffect(() => {
    const fetchAdminStats = async () => {
      const response = getAdminStatsRequest();
      console.log(response);
    };
    fetchAdminStats();
  }, []);


  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader
        title='Admin Dashboard'
        subtitle='System Overview & Management'
        uptime={MOCK_STATS.uptime}
        onLogout={handleLogout}
      />

      <main id='main' className='max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6'>
        {/* ── Stat Cards ── */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <StatsCard
            label='Total Users'
            value={MOCK_STATS.totalUsers}
            icon={<Users className='w-5 h-5 text-teal-500' />}
          />
          <StatsCard
            label='Active Learners'
            value={MOCK_STATS.activeLearners}
            icon={<UserCheck className='w-5 h-5 text-blue-500' />}
          />
          <StatsCard
            label='Total Sessions'
            value={MOCK_STATS.totalSessions}
            icon={<BarChart2 className='w-5 h-5 text-purple-500' />}
          />
        </div>

        {/* ── Tab Navigation ── */}
        <TabNav tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {/* ── Tab Content ── */}
        {activeTab === 'overview' && <OverviewTab onClick={setActiveTab} />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </main>
    </div>
  );
}

