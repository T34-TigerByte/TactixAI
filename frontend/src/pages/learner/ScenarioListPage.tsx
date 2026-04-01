import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Search, SlidersHorizontal, Clock } from 'lucide-react';
import DifficultyBadge from '../../components/ui/DifficultyBadge';
import DashboardHeader from '../../components/ui/DashboardHeader';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';

export interface Scenario {
  uuid: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_estimate: number;
  threat_actor: string;
}

const MOCK_SCENARIOS: Scenario[] = [
  {
    uuid: '00000000-0000-0000-0000-000000000001',
    title: 'Basic Ransomware Negotiation',
    description:
      'Learn fundamental negotiation tactics with a low-aggression ransomware operator. Perfect for beginners to understand the basics of ransomware...',
    difficulty: 'beginner',
    time_estimate: 20,
    threat_actor: 'Mike "SimpleCode" Johnson',
  },
  {
    uuid: '00000000-0000-0000-0000-000000000002',
    title: 'Corporate Ransomware Attack',
    description:
      'Handle a mid-level corporate ransomware attack with moderate pressure tactics and time constraints.',
    difficulty: 'intermediate',
    time_estimate: 35,
    threat_actor: 'Alex "CryptoWolf" Torres',
  },
  {
    uuid: '00000000-0000-0000-0000-000000000003',
    title: 'Advanced Ransomware Negotiation',
    description:
      'Practice high-stakes negotiations with sophisticated threat actors using psychological pressure tactics and complex demands.',
    difficulty: 'advanced',
    time_estimate: 45,
    threat_actor: 'Vladimir "CryptoKing" Petrov',
  },
  {
    uuid: '00000000-0000-0000-0000-000000000004',
    title: 'Healthcare Data Breach',
    description:
      'Navigate a sensitive healthcare ransomware incident with strict compliance requirements and public pressure.',
    difficulty: 'advanced',
    time_estimate: 50,
    threat_actor: 'Dr. "Phantom" Chen',
  },
  {
    uuid: '00000000-0000-0000-0000-000000000005',
    title: 'Financial Institution Ransomware',
    description:
      'Handle a ransomware attack on financial systems with regulatory pressures and high-value data theft.',
    difficulty: 'intermediate',
    time_estimate: 40,
    threat_actor: 'Viktor "PressureCooker" Ivanov',
  },
  {
    uuid: '00000000-0000-0000-0000-000000000006',
    title: 'Supply Chain Attack',
    description:
      'Respond to a sophisticated supply chain compromise affecting multiple downstream clients.',
    difficulty: 'advanced',
    time_estimate: 60,
    threat_actor: 'Group "ShadowNet"',
  },
];

interface ScenarioListPageProps {
  onStartScenario: (scenario: Scenario) => void;
}

export default function ScenarioListPage({ onStartScenario }: ScenarioListPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { logout } = useAuth();

  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Scenario['difficulty'] | 'all'>('all');

  const handleBack = () => navigate(ROUTES.LEARNER.DASHBOARD);
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  console.log(state)

  const filtered = useMemo(() => {
    // Prefer scenarios passed via location.state (from dashboard).
    // Fall back to MOCK_SCENARIOS so cards are always visible (e.g. when navigating back from ChatRoom).
    const stateScenarios = Array.isArray(state) ? state : state?.scenarios;
    const sourceData: Scenario[] = stateScenarios ?? MOCK_SCENARIOS;

    // TODO: replace sourceData with getScenariosRequest() once BE returns threat_actor as an object

    return sourceData.filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [search, state]);

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader
        title="Training Scenarios"
        subtitle="Choose a scenario to begin your training"
        onBack={handleBack}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search scenarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200
                         text-sm text-gray-700 placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
            />
          </div>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value as Scenario['difficulty'] | 'all')
            }
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700
                       focus:outline-none focus:ring-2 focus:ring-orange-300 cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{filtered.length} scenarios found</span>
          </div>
        </div>

        {/* Scenario Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((scenario) => (
            <div
              key={scenario.uuid}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col"
            >
              {/* Card Header */}
              <div className="bg-[#0f1c35] px-5 py-4 space-y-2">
                <h3 className="text-white font-bold text-lg leading-snug">{scenario.title}</h3>
                <DifficultyBadge level={scenario.difficulty} />
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col flex-1 space-y-4">
                <p className="text-gray-500 text-sm leading-relaxed flex-1">
                  {scenario.description}
                </p>

                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{scenario.time_estimate} min</span>
                  </div>
                </div>

                {/* Threat Actor */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Threat Actor</span>
                  <span className="text-sm font-medium text-gray-900">{scenario.threat_actor}</span>
                </div>

                <button
                  onClick={() => onStartScenario(scenario)}
                  className="w-full flex items-center justify-center gap-2
                             py-3 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                             text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Start Training
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="col-span-3 py-16 text-center text-gray-400 text-sm">
              No scenarios match your filters.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
