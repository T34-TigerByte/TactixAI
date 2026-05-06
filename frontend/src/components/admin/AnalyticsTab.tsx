import { BarChart2, Activity } from "lucide-react";
import SectionPanel from "../ui/SectionPanel";
import { useQuery } from "@tanstack/react-query";
import { getAdminAnalyticsRequest } from "../../api/admin.api";

const AnalyticsTab = () => {
  
  const { data: analytics } = useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: () => getAdminAnalyticsRequest(),
  });

  

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
    {/* User Growth */}
    <SectionPanel icon={<BarChart2 className='w-5 h-5' />} title='User Growth'>
      <div className='p-6 divide-y divide-gray-100'>
        {analytics?.user_growth.map(({ month, learners}) => (
          <div key={month} className='flex items-center justify-between py-4'>
            <span className='text-gray-700 font-medium'>{month}</span>
            <span className='text-gray-600 text-sm'>{learners} learners</span>
          </div>
        ))}
      </div>
    </SectionPanel>

    <SectionPanel icon={<Activity className='w-5 h-5' />} title='Platform Usage'>
      <div className='p-6 divide-y divide-gray-100'>
        {analytics && [
          { label: 'Daily Active Users', value: analytics?.platform_usage.daily_active_users },
          { label: 'Sessions per User', value: analytics?.platform_usage.sessions_per_user },
        ].map(({ label, value }) => (
          <div key={label} className='flex items-center justify-between py-4'>
            <span className='text-gray-700'>{label}</span>
            <span className='font-semibold text-gray-900'>{value}</span>
          </div>
        ))}
      </div>
    </SectionPanel>
  </div>
  )
};

export default AnalyticsTab;