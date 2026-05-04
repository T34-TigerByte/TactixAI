import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { ChevronDown } from 'lucide-react';
import DashboardHeader from '../../components/ui/DashboardHeader.tsx';
import { ROUTES } from '../../router/routes';
import { useAuth } from '../../hooks/useAuth';
import { useScenario } from '../../hooks/useScenario';
import type { LearnerScenario } from '../../schemas/api.schema';
import ScenarioCard from '../../components/learner/ScenarioCard';


interface ScenarioListPageProps {
  onStartScenario: (scenario: LearnerScenario) => void;
}

export default function ScenarioListPage({ onStartScenario }: ScenarioListPageProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { scenarios } = useScenario();

  const [threatActorFilter, setThreatActorFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all'); // Placeholder for future industry filter

  const handleBack = () => navigate(ROUTES.LEARNER.DASHBOARD);
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const threatActors = useMemo(
    () => [...new Set(scenarios.map((s) => s.threat_actor))],
    [scenarios],
  );

  const filtered = useMemo(() => {
    return scenarios.filter((s) => {

      const matchesThreatActor = threatActorFilter === 'all' || s.threat_actor === threatActorFilter;
      
      /* manually filter industry, by checking if scenario title or description includes such industry string */
      const matchesIndustry =
        industryFilter === 'all' ||
        s.title.toLowerCase().includes(industryFilter.toLowerCase()) ||
        s.description.toLowerCase().includes(industryFilter.toLowerCase());

      return matchesThreatActor && matchesIndustry;
    });

  }, [threatActorFilter, industryFilter, scenarios]);

  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader
        title='Training Scenarios'
        subtitle='Choose a scenario to begin your training'
        onLogoClick={handleBack}
        onBack={handleBack}
        onLogout={handleLogout}
      />

      <main className='max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6'>
        {/* Filter Bar */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-wrap items-center gap-3'>
          {/* Industry dropdown — placeholder until BE adds field */}
          <div className='relative'>
            <select
              className='appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-gray-200
                         text-sm font-medium text-[#0f1c35] bg-white
                         focus:outline-none focus:ring-2 focus:ring-orange-300'
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value='all'>All Industries</option>
              <option value='Bank'>Bank</option>
              <option value='Healthcare'>Healthcare</option>
              <option value='Mining'>Mining</option>
              <option value='University'>University</option>
            </select>
            <ChevronDown className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          </div>

          {/* Threat Actor dropdown */}
          <div className='relative'>
            <select
              value={threatActorFilter}
              onChange={(e) => setThreatActorFilter(e.target.value)}
              className='appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-gray-200
                         text-sm font-medium text-[#0f1c35] bg-white cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-orange-300'
            >
              <option value='all'>All Threat Actors</option>
              {threatActors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
            <ChevronDown className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          </div>

          <span className='ml-auto text-sm text-gray-400'>
            {filtered.length} scenarios found
          </span>
        </div>

        {/* Scenario Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filtered.map((scenario) => (
            <ScenarioCard
              key={scenario.uuid}
              scenario={scenario}
              onClick={onStartScenario}
              variant='full'
            />
          ))}

          {filtered.length === 0 && (
            <p className='col-span-3 py-16 text-center text-gray-400 text-sm'>
              No scenarios match your filters.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}