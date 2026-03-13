import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Users,
  UserCheck,
  BarChart2,
  LogOut,
  CheckCircle,
} from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';

import OverviewTab from '../../components/common/OverviewTab';
import UsersTab from '../../components/common/UsersTab';
import AnalyticsTab from '../../components/common/AnalyticsTab';
import StatsCard from '../../components/common/StatsCard';
import Logo from '../../components/common/Logo';

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

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* ── Header ── */}
      <header className='bg-slate-900 px-8 py-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-6'>
            <Logo />
            <div className='h-6 w-px bg-slate-600' />

            <div>
              <h1 className='text-white font-bold text-lg leading-tight'>
                Admin Dashboard
              </h1>
              <p className='text-slate-400 text-sm'>
                System Overview & Management
              </p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            {/* Uptime badge */}
            <div
              className='flex items-center gap-2 px-4 py-2 rounded-lg
                            bg-teal-500/20 border border-teal-500/30
                            text-teal-400 text-sm font-medium'
            >
              <CheckCircle className='w-4 h-4' />
              {MOCK_STATS.uptime}% Uptime
              {/* TODO: replace with real uptime from GET /admin/system/health */}
            </div>

            <button
              onClick={handleLogout}
              className='flex items-center gap-2 px-4 py-2 rounded-lg
                         border border-slate-600 text-slate-300
                         hover:border-slate-400 hover:text-white
                         transition-colors text-sm font-medium'
            >
              <LogOut className='w-4 h-4' />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-8 py-8 space-y-6'>
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

