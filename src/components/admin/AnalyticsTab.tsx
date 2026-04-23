import { BarChart2, Activity } from "lucide-react";
import SectionPanel from "../ui/SectionPanel";


const MOCK_GROWTH = [
  { month: 'Jan', count: 98 },
  { month: 'Feb', count: 124 },
  { month: 'Mar', count: 156 },
];

const MOCK_PLATFORM = [
  { label: 'Daily Active Users', value: '89' },
  { label: 'Sessions per User', value: '7.2' },
  { label: 'Avg Session Duration', value: '32 min' },
  { label: 'Completion Rate', value: '87%' },
];

const AnalyticsTab = () => (
  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
    {/* User Growth */}
    <SectionPanel icon={<BarChart2 className='w-5 h-5' />} title='User Growth'>
      <div className='p-6 divide-y divide-gray-100'>
        {MOCK_GROWTH.map(({ month, count }) => (
          <div key={month} className='flex items-center justify-between py-4'>
            <span className='text-gray-700 font-medium'>{month}</span>
            <span className='text-gray-600 text-sm'>{count} learners</span>
          </div>
        ))}
      </div>
    </SectionPanel>

    <SectionPanel icon={<Activity className='w-5 h-5' />} title='Platform Usage'>
      <div className='p-6 divide-y divide-gray-100'>
        {MOCK_PLATFORM.map(({ label, value }) => (
          <div key={label} className='flex items-center justify-between py-4'>
            <span className='text-gray-700'>{label}</span>
            <span className='font-semibold text-gray-900'>{value}</span>
          </div>
        ))}
      </div>
    </SectionPanel>
  </div>
);

export default AnalyticsTab;