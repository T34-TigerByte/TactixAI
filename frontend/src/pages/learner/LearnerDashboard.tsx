import { Target, Clock, TrendingUp, BookOpen, BarChart2, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth }  from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';
import SkillProgressPanel from '../../components/ui/SkillProgressPanel';
import StatsCard from '../../components/ui/StatsCard';
import SectionPanel from '../../components/ui/SectionPanel';
import ActionListItem from '../../components/ui/ActionListItem';
import DashboardHeader from '../../components/ui/DashboardHeader.tsx';
import { useQuery } from '@tanstack/react-query';
import { getLearnerStatsRequest, getSessionsRequest } from '../../api/learner.api';
import ScenarioCard from '../../components/learner/ScenarioCard';
import { useScenario } from '../../hooks/useScenario.ts';

// const MOCK_STATS = {
//   totalSessions: 24,
//   averageScore: 78,
//   trainingHours: 32,
//   currentStreak: 5,
// };

// const MOCK_SCENARIOS: LearnerScenario[] = [
//   {
//     uuid: '00000000-0000-0000-0000-000000000003',
//     title: 'Advanced Ransomware Negotiation',
//     description:
//       'Practice high-stakes negotiations with sophisticated threat actors using psychological pressure tactics.',
//     difficulty: 'advanced',
//     time_estimate: 45,
//     objectives: 5,
//     threat_actor: {
//       name: 'Vladimir "CryptoKing" Petrov',
//       description: 'Psychological pressure with business-like professionalism',
//       aggression: 8,
//     },
//   },
//   {
//     uuid: '00000000-0000-0000-0000-000000000005',
//     title: 'Financial Institution Ransomware',
//     description:
//       'Handle a ransomware attack on financial systems with regulatory pressures and high-value data theft.',
//     difficulty: 'intermediate',
//     time_estimate: 40,
//     objectives: 5,
//     threat_actor: {
//       name: 'Viktor "PressureCooker" Ivanov',
//       description: 'Aggressive financial leverage with tight deadlines',
//       aggression: 7,
//     },
//   },
// ];

function formatSessionDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}


export default function LearnerDashboard () {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { data: learnerStats } = useQuery({
      queryKey: ['learner', 'stats'],
      queryFn: getLearnerStatsRequest,
    });
    const { data: sessionsPage } = useQuery({
      queryKey: ['learner', 'sessions'],
      queryFn: () => getSessionsRequest(),
    });
    const recentSessions = sessionsPage?.data.slice(0, 3) ?? [];
    const { scenarios, setSelectedScenario } = useScenario();

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN, { replace: true});
    };

    const handleStartScenario = (scenario: Parameters<typeof setSelectedScenario>[0]) => {
        setSelectedScenario(scenario);
        navigate(`/learner/chat/${scenario.uuid}`);
    };

    const handleViewAllScenario = () => {
        navigate(ROUTES.LEARNER.SCENARIOS, { state: { scenarios } });
    }

    return (
      <div className='min-h-screen bg-gray-100'>
        <DashboardHeader
          title='Learner Dashboard'
          subtitle={`Welcome back, ${user?.first_name ?? 'Learner'}`}
          onProfile={() => navigate(ROUTES.LEARNER.PROFILE)}
          onLogout={handleLogout}
        />

        <main id='main' className='max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8'>
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
                  value={learnerStats.session.average_score !== undefined ? `${learnerStats.session.average_score}%` : '—'}
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
            <SectionPanel icon={<BookOpen className='w-5 h-5' />} title='Recommended Scenarios'>
              <div className='p-4 space-y-3'>
                {scenarios?.map((scenario) => (
                  <ScenarioCard key={scenario.uuid} scenario={scenario} onClick={handleStartScenario} />
                ))}
                <button
                  className='w-full py-3 rounded-xl border border-gray-200 text-red-600 font-medium text-sm hover:bg-orange-50 transition-colors mt-1 cursor-pointer'
                  onClick={handleViewAllScenario}
                >
                  View All Scenarios
                </button>
              </div>
            </SectionPanel>

            {/* Session History */}
            <SectionPanel icon={<BarChart2 className='w-5 h-5' />} title='Session History'>
              <div className='p-4 space-y-1'>
                {recentSessions.length === 0 ? (
                  <p className='text-center text-gray-400 text-sm py-8'>No sessions yet.</p>
                ) : (
                  recentSessions.map((session) => (
                    <ActionListItem
                      key={session.uuid}
                      title={session.title}
                      subtitle={session.end_at ? formatSessionDate(session.end_at) : 'In Progress'}
                      actions={
                        <button
                          onClick={() => navigate(ROUTES.LEARNER.SESSION_HISTORY.replace(':sessionId', session.uuid))}
                          className='px-3 py-1.5 rounded-lg border border-orange-500 text-orange-500 text-xs font-semibold hover:bg-orange-50 transition-colors cursor-pointer'
                        >
                          View Chat
                        </button>
                      }
                    />
                  ))
                )}
                <button
                  className='w-full py-3 rounded-xl border border-gray-200 text-red-600 font-medium text-sm hover:bg-orange-50 transition-colors mt-2 cursor-pointer'
                  onClick={() => navigate(ROUTES.LEARNER.PROGRESS)}
                >
                  View All Sessions
                </button>
              </div>
            </SectionPanel>
          </div>
        </main>
      </div>
    );
};


