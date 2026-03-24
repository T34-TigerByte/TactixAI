import { Target, Clock, TrendingUp, BookOpen, BarChart2, Play, LogOut, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth }  from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';
import DifficultyBadge from '../../components/ui/DifficultyBadge';
import SkillProgressPanel from '../../components/ui/SkillProgressPanel';
import StatsCard from '../../components/ui/StatsCard';
import PanelHeader from '../../components/ui/PanelHeader';
import Logo from '../../components/ui/Logo';
import { useEffect, useState } from 'react';
import { getLearnerStatsRequest } from '../../api/learner.api';
import type { LearnerStats } from '../../types/learner.types';

// const MOCK_STATS = {
//   totalSessions: 24,
//   averageScore: 78,
//   trainingHours: 32,
//   currentStreak: 5,
// };

const MOCK_SCENARIOS = [
  {
    id: '1',
    title: 'Advanced Ransomware Negotiation',
    desc: 'Practice high-stakes negotiations with sophisticated threat actors using psychological pressure tactics.',
    difficulty: 'advanced' as const,
    duration: 45,
  },
  {
    id: '2',
    title: 'Financial Institution Ransomware',
    desc: 'Handle a ransomware attack on financial systems with regulatory pressures and high-value data theft.',
    difficulty: 'advanced' as const,
    duration: 60,
  },
];

const MOCK_ACTIVITY = [
  {
    id: '1',
    title: 'Corporate Ransomware Attack',
    difficulty: 'intermediate' as const,
    date: '3/14/2024',
    score: 85,
    status: 'completed' as const,
  },
  {
    id: '2',
    title: 'Basic Ransomware Negotiation',
    difficulty: 'beginner' as const,
    date: '3/14/2024',
    score: 72,
    status: 'completed' as const,
  },
  {
    id: '3',
    title: 'Healthcare Ransomware Crisis',
    difficulty: 'advanced' as const,
    date: null,
    score: null,
    status: 'in_progress' as const,
  },
];


export default function LearnerDashboard () {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [learnerStats, setLearnerStats] = useState<LearnerStats>();
    

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN, { replace: true});
    };

    useEffect(() => {
      const fetchStats = async () => {
        const response = await getLearnerStatsRequest();
        setLearnerStats(response);
      }
      fetchStats();
    }, [])

    const handleStartScenario  = (id: string ) => {
        //  TODO: navigate to chat page with session creation
        navigate(`/learner/chat/${id}`);
    }

    return (
      <div className='min-h-screen bg-gray-100'>
        {/* Header */}
        <header className='bg-slate-900 px-8 py-4'>
          <div className='max-w-7xl mx-auto flex items-center justify-between'>
            {/* Logo / Title */}
            <div className='flex items-center gap-6'>
              <Logo />
              <div className='h-6 w-px bg-slate-600' />
              <div>
                <h1 className='text-white font-bold text-lg leading-tight'>
                  Learner Dashboard
                </h1>
                <p className='text-slate-400 text-sm'>
                  Welcome back, {user?.first_name ?? 'Learner'}
                </p>
              </div>
            </div>
            {/* Logout Button */}
            <div className='flex items-center gap-3'>
              <button
                className='flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-orange-600 text-white text-sm font-medium cursor-pointer'
                onClick={() => navigate(ROUTES.LEARNER.PROFILE)}
              >
                <User className='w-4 h-4'/>
                Profile
              </button>

              <button
                onClick={handleLogout}
                className='flex items-center gap-2 px-4 py-2 rounded-lg
                                    border border-red-400 text-red-400
                                    hover:border-red-600 hover:text-red-600
                                    transition-colors text-sm font-medium
                                    cursor-pointer'
              >
                <LogOut className='w-4 h-4' />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className='max-w-7xl mx-auto px-8 py-8 space-y-8'>
          {/* ── Stats Row ── */}
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
            {learnerStats && (
              <>
                <StatsCard
                  label='Total Sessions'
                  value={learnerStats.session.total}
                  icon={<MessageSquare className='w-5 h-5 text-teal-500' />}
                />
                <StatsCard
                  label='Average Score'
                  value={`${learnerStats.session.average_score}%`}
                  valueColor='text-orange-500'
                  icon={<Target className='w-5 h-5 text-orange-400' />}
                />
                <StatsCard
                  label='Training Hours'
                  value={`${learnerStats.session.total_hours}h`}
                  icon={<Clock className='w-5 h-5 text-purple-500' />}
                />
                <StatsCard
                  label='Current Streak'
                  value={5}
                  valueColor='text-red-500'
                  icon={<TrendingUp className='w-5 h-5 text-red-500' />}
                />
              </>
            )}
          </div>

          {/* ── Skill Development Progress ── */}
          {learnerStats?.progress && (
            <SkillProgressPanel progress={learnerStats.progress} />
          )}

          {/* ── 2 Rows at the bottom ── */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Recommended Scenarios */}
            <section
              className='bg-white rounded-xl border border-gray-200
                                        shadow-sm overflow-hidden'
            >
              {/* Panel Header */}
              <PanelHeader
                icon={<BookOpen className='w-5 h-5' />}
                title='Recommended Scenarios'
              />

              {/* Scenario Cards */}
              <div className='p-4 space-y-3'>
                {MOCK_SCENARIOS.map((scenario) => (
                  <div
                    key={scenario.id}
                    className='p-4 rounded-xl border border-gray-200
                                        hover:border-gray-300 hover:shadow-sm
                                        transition-all space-y-3'
                  >
                    <div>
                      <h3 className='font-semibold text-gray-900 mb-1'>
                        {scenario.title}
                      </h3>
                      <p className='text-gray-500 text-sm leading-relaxed'>
                        {scenario.desc}
                      </p>
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <DifficultyBadge level={scenario.difficulty} />
                        <div className='flex items-center gap-1 text-gray-500 text-sm'>
                          <Clock className='w-3.5 h-3.5' />
                          <span>{scenario.duration}m</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartScenario(scenario.id)}
                        className='flex items-center gap-2 px-4 py-2 rounded-lg
                                            bg-orange-600 hover:bg-orange-700 active:bg-orange-800
                                            text-white text-sm font-medium
                                            transition-colors
                                            cursor-pointer'
                      >
                        <Play className='w-3.5 h-3.5 fill-white' />
                        Start
                      </button>
                    </div>
                  </div>
                ))}

                {/* View All */}
                <button
                  className='w-full py-3 rounded-xl border border-gray-200
                                            text-red-600 font-medium text-sm
                                            hover:bg-orange-50 transition-colors mt-1
                                            cursor-pointer'
                >
                  View All Scenarios
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section
              className='bg-white rounded-xl border border-gray-200
                                        shadow-sm overflow-hidden'
            >
              {/* Panel Header */}
              <PanelHeader
                icon={<BarChart2 className='w-5 h-5' />}
                title='Recent Activity'
              />

              {/* Activity List */}
              <div className='p-4 space-y-1'>
                {MOCK_ACTIVITY.map((activity) => (
                  <div
                    key={activity.id}
                    className='flex items-center justify-between
                                        px-3 py-4 rounded-lg hover:bg-gray-50
                                        transition-colors'
                  >
                    <div className='space-y-1.5'>
                      <p className='font-semibold text-gray-900 text-sm'>
                        {activity.title}
                      </p>
                      <div className='flex items-center gap-2'>
                        <DifficultyBadge level={activity.difficulty} />
                        {activity.date && (
                          <span className='text-gray-400 text-xs'>
                            {activity.date}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Scores / Status */}
                    {activity.status === 'completed' &&
                    activity.score !== null ? (
                      <span
                        className={`font-bold text-lg ${
                          activity.score >= 80
                            ? 'text-teal-500'
                            : 'text-orange-500'
                        }`}
                      >
                        {activity.score}%
                      </span>
                    ) : (
                      <span
                        className='px-3 py-1 rounded-full text-xs font-semibold
                                                bg-orange-500 text-white'
                      >
                        In Progress
                      </span>
                    )}
                  </div>
                ))}

                {/* View Detailed Progress */}

                <button
                  className='w-full py-3 rounded-xl border border-gray-200
                                            text-red-600 font-medium text-sm
                                            hover:bg-orange-50 transition-colors mt-2
                                            cursor-pointer'
                >
                  View Detailed Progress
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
};


