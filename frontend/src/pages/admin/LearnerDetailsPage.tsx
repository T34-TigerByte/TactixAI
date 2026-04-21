import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, Clock, Calendar, CheckCircle2, FileText } from 'lucide-react';


import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';
import DashboardHeader from '../../components/ui/DashboardHeader.tsx';
import StatsCard from '../../components/ui/StatsCard';
import PanelHeader from '../../components/ui/PanelHeader';
import TabNav from '../../components/ui/TabNav';
import type { AdminUserListItem } from '../../schemas/api.schema';

interface Session {
  id: string;
  scenario_name: string;
  date: string;
}

interface SkillProgress {
  skill_name: string;
  current_score: number;
  session_count: number;
  delta: number;
}
import { formatDate } from '../../utils/format.utils';

// TODO: replace with API calls
const MOCK_SESSIONS: Session[] = [
  { id: '1', scenario_name: 'Financial Institution Data Breach', date: '2024-03-15' },
  { id: '2', scenario_name: 'Healthcare Ransomware Crisis', date: '2024-03-11' },
  { id: '3', scenario_name: 'University Research Lab Encryption', date: '2024-03-05' },
];

const MOCK_SKILLS: SkillProgress[] = [
  { skill_name: 'Communication Effectiveness', current_score: 82, session_count: 8, delta: 7 },
  { skill_name: 'Negotiation Strategy', current_score: 75, session_count: 8, delta: 7 },
  { skill_name: 'Risk Management', current_score: 88, session_count: 8, delta: 6 },
];

const SKILL_COLORS = ['bg-teal-400', 'bg-orange-400', 'bg-purple-500'];

type Tab = 'session_history' | 'skill_progress';

export default function LearnerDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = state?.user as AdminUserListItem | undefined;
  const [activeTab, setActiveTab] = useState<Tab>('session_history');

  const handleBack = () => navigate(`${ROUTES.ADMIN.DASHBOARD}?tab=users`);
  
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500'>
        User not found.{' '}
        <button onClick={handleBack} className='ml-2 text-orange-600 underline cursor-pointer'>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader
        title='Learner Details'
        subtitle={user.email}
        onLogoClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
        onBack={handleBack}
        onLogout={handleLogout}
      />

      <main className='max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-4'>
        {/* User Info Card */}
        <div
          className='bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4
                        grid grid-cols-2 sm:grid-cols-4 gap-4'
        >
          <div>
            <p className='text-gray-400 text-xs mb-1'>Email</p>
            <p className='text-gray-900 text-sm font-medium'>{user.email}</p>
          </div>
          <div>
            <p className='text-gray-400 text-xs mb-1'>Company</p>
            <p className='text-gray-900 text-sm font-medium flex items-center gap-1'>
              <Building2 className='w-3.5 h-3.5 text-gray-400' />
              {user.company ?? '—'}
            </p>
          </div>
          <div>
            <p className='text-gray-400 text-xs mb-1'>Last Session</p>
            <p className='text-gray-900 text-sm font-medium flex items-center gap-1'>
              <Clock className='w-3.5 h-3.5 text-gray-400' />
              {user.session.last_session_at ? formatDate(user.session.last_session_at) : '—'}
            </p>
          </div>
          <div>
            <p className='text-gray-400 text-xs mb-1'>Joined Date</p>
            <p className='text-gray-900 text-sm font-medium flex items-center gap-1'>
              <Calendar className='w-3.5 h-3.5 text-gray-400' />
              {formatDate(user.joined_at)}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 gap-4'>
          <StatsCard
            label='Completed Sessions'
            value={user.session.completed ?? 0}
            icon={<CheckCircle2 className='w-8 h-8 text-teal-400' />}
          />
          <StatsCard
            label='Time Spent'
            value={
              user.session.total_time_spent != null
                ? `${user.session.total_time_spent}m`
                : '—'
            }
            icon={<Clock className='w-8 h-8 text-orange-400' />}
          />
        </div>

        {/* Tabs */}
        <TabNav
          tabs={[
            { key: 'session_history', label: 'Session History' },
            { key: 'skill_progress', label: 'Skill Progress' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === 'session_history' && (
          <div className='bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100'>
            {MOCK_SESSIONS.map((session) => (
              <div
                key={session.id}
                className='px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'
              >
                <div>
                  <p className='font-semibold text-gray-900'>
                    {session.scenario_name}
                  </p>
                  <p className='text-gray-400 text-sm mt-0.5'>{session.date}</p>
                </div>
                <div className='flex items-center gap-2 shrink-0'>
                  <button
                    className='flex-1 sm:flex-none px-4 py-1.5 rounded-lg border border-orange-600 text-orange-600
                               hover:bg-orange-50 text-sm font-medium transition-colors cursor-pointer'
                  >
                    View Chat
                  </button>
                  <button
                    className='flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg border border-orange-600
                               text-orange-600 hover:bg-orange-50 text-sm font-medium transition-colors cursor-pointer'
                  >
                    <FileText className='w-3.5 h-3.5' />
                    Export
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skill_progress' && (
          <div className='bg-white rounded-xl border border-gray-200 shadow-sm'>
            <PanelHeader title='Skill Progress' />
            <div className='grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100'>
              {MOCK_SKILLS.map((skill, i) => (
                <div key={skill.skill_name} className='px-6 py-5 space-y-3'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='font-semibold text-gray-900 text-sm'>
                      {skill.skill_name}
                    </p>
                    <span className='text-teal-500 text-xs font-medium whitespace-nowrap shrink-0'>
                      ↑ +{skill.delta}
                    </span>
                  </div>
                  <div className='flex justify-between text-gray-500 text-xs'>
                    <span>Current: {skill.current_score}%</span>
                    <span>{skill.session_count} sessions</span>
                  </div>
                  <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className={`h-full rounded-full ${SKILL_COLORS[i]}`}
                      style={{ width: `${skill.current_score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
