import { BarChart2, Activity } from "lucide-react";
import PanelHeader from "../ui/PanelHeader";


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
    <section className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      <PanelHeader
        icon={<BarChart2 className='w-5 h-5' />}
        title='User Growth'
      />
      <div className='p-6 divide-y divide-gray-100'>
        {MOCK_GROWTH.map(({ month, count }) => (
          <div key={month} className='flex items-center justify-between py-4'>
            <span className='text-gray-700 font-medium'>{month}</span>
            <span className='text-gray-600 text-sm'>{count} learners</span>
          </div>
        ))}
      </div>
    </section>

    {/* Platform Usage */}
    <section className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      <PanelHeader
        icon={<Activity className='w-5 h-5' />}
        title='Platform Usage'
      />
      <div className='p-6 divide-y divide-gray-100'>
        {MOCK_PLATFORM.map(({ label, value }) => (
          <div key={label} className='flex items-center justify-between py-4'>
            <span className='text-gray-700'>{label}</span>
            <span className='font-semibold text-gray-900'>{value}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default AnalyticsTab;