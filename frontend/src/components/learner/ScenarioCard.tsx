import { Clock, Play } from 'lucide-react';
import type { LearnerScenario } from '../../schemas/api.schema';
import BoolBadge from '../ui/BoolBadge';

interface ScenarioCardProps {
  scenario: LearnerScenario;
  onClick: (scenario: LearnerScenario) => void;
  variant?: 'compact' | 'full';
}

export default function ScenarioCard({ scenario, onClick, variant = 'compact' }: ScenarioCardProps) {
  if (variant === 'full') {
    return (
      <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col'>
        <div className='bg-[#0f1c35] px-5 py-4'>
          <h3 className='text-white font-bold text-lg leading-snug'>{scenario.title}</h3>
        </div>

        <div className='p-5 flex flex-col flex-1 space-y-4'>
          <p className='text-gray-500 text-sm leading-relaxed flex-1'>{scenario.description}</p>

          <div className='flex items-center gap-4 text-gray-400 text-sm justify-between'>
            <div className='flex items-center gap-1'>
              <Clock className='w-4 h-4' />
              <span>{scenario.time_estimate} min</span>
            </div>
            <BoolBadge label='Completed' value={scenario.completed ?? false} />
          </div>

          <div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between'>
            <span className='text-sm font-semibold text-gray-700'>Threat Actor</span>
            <span className='text-sm font-medium text-gray-900'>{scenario.threat_actor}</span>
          </div>

          <button
            onClick={() => onClick(scenario)}
            className='w-full flex items-center justify-center gap-2
                       py-3 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                       text-white font-semibold text-sm transition-colors cursor-pointer'
          >
            <svg className='w-4 h-4 fill-white' viewBox='0 0 24 24'>
              <path d='M8 5v14l11-7z' />
            </svg>
            Start Training
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all space-y-3'>
      <div>
        <h3 className='font-semibold text-gray-900 mb-1'>{scenario.title}</h3>
        <p className='text-gray-500 text-sm leading-relaxed'>{scenario.description}</p>
      </div>

      <div className='flex items-center justify-between'>
        <BoolBadge label='Completed' value={scenario.completed ?? false} />
        <button
          onClick={() => onClick(scenario)}
          className='flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-orange-600 hover:bg-orange-700 active:bg-orange-800
                     text-white text-sm font-medium transition-colors cursor-pointer'
        >
          <Play className='w-3.5 h-3.5 fill-white' />
          Start
        </button>
      </div>
    </div>
  );
}
