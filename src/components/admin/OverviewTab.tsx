import PanelHeader from "../ui/PanelHeader";
import { Settings, Users, Activity, FileText } from "lucide-react";
import type { AdminTab } from "../../types/admin.types";
import { useOverviewTab } from "../../hooks/useOverviewTab";

const OverviewTab = ({ onClick }: { onClick: (tab: AdminTab) => void }) => {

  const { state } = useOverviewTab();
  const { activities } = state;


  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {/* Recent Activity */}
      <section className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
        <PanelHeader
          icon={<Activity className='w-5 h-5' />}
          title='Recent Activity'
        />
        <div className='divide-y divide-gray-100'>
          {activities.map((item) => (
            <div
              key={item.user_name}
              className='flex items-start justify-between px-6 py-4
                        hover:bg-gray-50 transition-colors'
            >
              <div className='space-y-0.5'>
                <p className='font-semibold text-gray-900 text-sm'>{item.user_name}</p>
                <p className='text-gray-500 text-xs'>{item.type}</p>
                <p className='text-gray-400 text-xs'>{item.created_at}</p>
              </div>
              {/* <span
                className={`text-sm font-medium shrink-0 ml-4 ${
                  item.status === 'warning' ? 'text-orange-500' : 'text-gray-500'
                }`}
              >
                {item.status}
              </span> */}
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
            onClick={() => { onClick('users')}}
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
}

export default OverviewTab;