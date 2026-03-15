import PanelHeader from "../ui/PanelHeader";
import { Settings, Users, Activity, FileText } from "lucide-react";


const MOCK_ACTIVITY = [
  {
    id: '1',
    name: 'Test user1',
    action: 'registered as Learner',
    time: '3/15/2024, 8:30:00 PM',
    status: 'success' as const,
  },
  {
    id: '2',
    name: 'Test user2',
    action: 'completed Advanced Ransomware scenario',
    time: '3/15/2024, 7:45:00 PM',
    status: 'success' as const,
  },
  {
    id: '3',
    name: 'System',
    action: 'High memory usage detected',
    time: '3/15/2024, 7:15:00 PM',
    status: 'warning' as const,
  },
  {
    id: '4',
    name: 'Test user3',
    action: 'completed Financial Institution scenario',
    time: '3/15/2024, 6:50:00 PM',
    status: 'success' as const,
  },
  {
    id: '5',
    name: 'System',
    action: 'Backup completed successfully',
    time: '3/15/2024, 6:00:00 PM',
    status: 'success' as const,
  },
];

const OverviewTab = () => (
  <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
    {/* Recent Activity */}
    <section className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      <PanelHeader
        icon={<Activity className='w-5 h-5' />}
        title='Recent Activity'
      />
      <div className='divide-y divide-gray-100'>
        {MOCK_ACTIVITY.map((item) => (
          <div
            key={item.id}
            className='flex items-start justify-between px-6 py-4
                       hover:bg-gray-50 transition-colors'
          >
            <div className='space-y-0.5'>
              <p className='font-semibold text-gray-900 text-sm'>{item.name}</p>
              <p className='text-gray-500 text-xs'>{item.action}</p>
              <p className='text-gray-400 text-xs'>{item.time}</p>
            </div>
            <span
              className={`text-sm font-medium shrink-0 ml-4 ${
                item.status === 'warning' ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </section>

    {/* Quick Actions */}
    <section className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
      <PanelHeader
        icon={<Settings className='w-5 h-5' />}
        title='Quick Actions'
      />
      <div className='p-6 space-y-3'>
        <button
          className='w-full flex items-center gap-3 px-5 py-4 rounded-lg
                           bg-orange-600 hover:bg-orange-700 text-white font-medium
                           transition-colors cursor-pointer'
        >
          <Users className='w-5 h-5' />
          Manage Users
        </button>
        <button
          className='w-full flex items-center gap-3 px-5 py-4 rounded-lg
                           border border-red-300 text-red-600 font-medium
                           hover:bg-orange-50 transition-colors cursor-pointer'
        >
          <FileText className='w-5 h-5' />
          Generate Reports
        </button>
      </div>
    </section>
  </div>
);


export default OverviewTab;