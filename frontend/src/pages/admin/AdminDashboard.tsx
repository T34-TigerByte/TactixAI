import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Users, UserCheck, BarChart2 } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';

import OverviewTab from '../../components/admin/OverviewTab';
import UsersTab from '../../components/admin/UsersTab';
import AnalyticsTab from '../../components/admin/AnalyticsTab';
import StatsCard from '../../components/ui/StatsCard';
import DashboardHeader from '../../components/ui/DashboardHeader';
import { AdminStatsRequest } from '../../api/admin.api';

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

type Tab = 'overview' | 'users' | 'analytics';

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'User Management' },
    { key: 'analytics', label: 'Analytics' },
  ];

  useEffect(() => {
      const response = AdminStatsRequest();
      console.log(response);
  }, [])

  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader
        title='Admin Dashboard'
        subtitle='System Overview & Management'
        uptime={MOCK_STATS.uptime}
        onLogout={handleLogout}
      />

      <main className='max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6'>
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
        <div className='flex rounded-xl overflow-hidden bg-slate-900 p-1'>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium
                          transition-colors ${
                            activeTab === tab.key
                              ? 'bg-orange-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }
                          cursor-pointer`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ── */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </main>
    </div>
  );
}

