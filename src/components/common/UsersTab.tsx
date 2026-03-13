import { Users } from 'lucide-react';

const MOCK_USER_COUNTS = {
  learners: 156,
  admins: 5,
};
const UsersTab = () => (

  <div>
    <div className='flex items-center justify-between mb-4'>
      <h2 className='text-gray-900 font-semibold text-lg'>User Management</h2>
      <button
        className='flex items-center gap-2 px-4 py-2 rounded-lg
                         bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium
                         transition-colors'
      >
        <Users className='w-4 h-4' />
        View All Users
      </button>
    </div>

    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      {[
        {
          role: 'Learners',
          count: MOCK_USER_COUNTS.learners,
          label: 'Active learners',
          action: 'Manage Learners',
        },
        {
          role: 'Admins',
          count: MOCK_USER_COUNTS.admins,
          label: 'System admins',
          action: 'Manage Admins',
        },
      ].map(({ role, count, label, action }) => (
        <div
          key={role}
          className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'
        >
          <div className='bg-slate-900 px-6 py-4'>
            <h3 className='text-white font-semibold text-center'>{role}</h3>
          </div>
          <div className='p-8 text-center space-y-1'>
            <p className='text-5xl font-bold text-gray-900'>{count}</p>
            <p className='text-gray-500 text-sm'>{label}</p>
          </div>
          <div className='px-6 pb-6'>
            <button
              className='w-full py-3 rounded-lg bg-orange-600 hover:bg-orange-700
                               text-white font-medium transition-colors'
            >
              {action}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UsersTab;