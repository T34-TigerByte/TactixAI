import type { LearnerScenario } from "../../schemas/api.schema";
// import DifficultyBadge from "../ui/DifficultyBadge";
import { Play } from "lucide-react";

interface ScenarioCardProps {
  scenario: LearnerScenario,
  onClick: (title: string) => void;
}


export default function ScenarioCard ({scenario, onClick}: ScenarioCardProps) {
    return (
      <div
        key={scenario.uuid}
        className='p-4 rounded-xl border border-gray-200
                                        hover:border-gray-300 hover:shadow-sm
                                        transition-all space-y-3'
      >
        <div>
          <h3 className='font-semibold text-gray-900 mb-1'>{scenario.title}</h3>
          <p className='text-gray-500 text-sm leading-relaxed'>
            {scenario.description}
          </p>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {/* Time Estimates and Difficult NEEDED */}
            {/* <DifficultyBadge level={scenario.difficulty} /> */}
            {/* <div className='flex items-center gap-1 text-gray-500 text-sm'>
              <Clock className='w-3.5 h-3.5' />
              <span>{scenario.time_estimate}m</span>
            </div> */}
          </div>
          <button
            onClick={() => onClick(scenario.uuid)}
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
    );
}