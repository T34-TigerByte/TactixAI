import { Target } from 'lucide-react';

import type { LearnerProgress } from '../../schemas/api.schema';
import SectionPanel from './SectionPanel';

interface Props {
  progress: LearnerProgress;
}

const SKILLS: {
  label: string;
  key: keyof LearnerProgress;
  color: string;
  bar: string;
}[] = [
  { label: 'Communication Effectiveness', key: 'communication', color: 'text-teal-500', bar: 'bg-teal-400' },
  { label: 'Negotiation Strategy', key: 'negotiation', color: 'text-orange-500', bar: 'bg-orange-500' },
  { label: 'Risk Management', key: 'risk_management', color: 'text-purple-500', bar: 'bg-purple-500' },
];

export default function SkillProgressPanel({ progress }: Props) {
  return (
    <SectionPanel icon={<Target className='w-5 h-5' />} title='Skill Development Progress'>
      <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
        {SKILLS.map(({ label, key, color, bar }) => (
          <div key={key} className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-gray-800'>{label}</span>
              <span className={`text-sm font-bold ${color}`}>{progress[key]}%</span>
            </div>
            <div className='h-2 rounded-full bg-gray-100'>
              <div
                className={`h-2 rounded-full ${bar} transition-all`}
                style={{ width: `${progress[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionPanel>
  );
}
