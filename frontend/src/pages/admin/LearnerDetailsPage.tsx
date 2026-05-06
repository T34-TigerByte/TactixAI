import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, Clock, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';
import DashboardHeader from '../../components/ui/DashboardHeader.tsx';
import StatsCard from '../../components/ui/StatsCard';
import type { AdminUserListItem } from '../../schemas/api.schema';
import { getAdminSessionsRequest } from '../../api/admin.api';
import { formatDate, formatDuration } from '../../utils/format.utils';

export default function LearnerDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const user = state?.user as AdminUserListItem | undefined;

  const { data: sessionsPage } = useQuery({
    queryKey: ['admin', 'sessions', user?.id],
    queryFn: () => getAdminSessionsRequest(user!.id),
    enabled: !!user?.id,
  });

  const handleBack = () => navigate(`${ROUTES.ADMIN.DASHBOARD}?tab=users`);
  
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const handleViewReport = (sessionId: string) => {
    navigate(ROUTES.ADMIN.SESSION_VIEW.replace(':sessionId', sessionId), {
      state: { user, sessionTitle: sessionsPage?.data.find(s => s.uuid === sessionId)?.title },
    });
  }

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500'>
        User not found.{' '}
        <button onClick={handleBack} className='ml-2 text-orange-600 underline cursor-pointer'>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader
        title='Learner Details'
        subtitle={user.email}
        onLogoClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}
        onBack={handleBack}
        onLogout={handleLogout}
      />

      <main className='max-w-4xl mx-auto px-4 sm:px-8 py-6 space-y-4'>
        {/* User Info Card */}
        <div
          className='bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4
                        grid grid-cols-2 sm:grid-cols-4 gap-4'
        >
          <div>
            <p className='text-gray-400 text-xs mb-1'>Email</p>
            <p className='text-gray-900 text-sm font-medium'>{user.email}</p>
          </div>
          <div>
            <p className='text-gray-400 text-xs mb-1'>Company</p>
            <p className='text-gray-900 text-sm font-medium flex items-center gap-1'>
              <Building2 className='w-3.5 h-3.5 text-gray-400' />
              {user.company ?? '—'}
            </p>
          </div>
          <div>
            <p className='text-gray-400 text-xs mb-1'>Last Session</p>
            <p className='text-gray-900 text-sm font-medium flex items-center gap-1'>
              <Clock className='w-3.5 h-3.5 text-gray-400' />
              {user.session.last_session_at
                ? formatDate(user.session.last_session_at)
                : '—'}
            </p>
          </div>
          <div>
            <p className='text-gray-400 text-xs mb-1'>Joined Date</p>
            <p className='text-gray-900 text-sm font-medium flex items-center gap-1'>
              <Calendar className='w-3.5 h-3.5 text-gray-400' />
              {formatDate(user.joined_at)}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-2 gap-4'>
          <StatsCard
            label='Completed Sessions'
            value={user.session.completed ?? 0}
            icon={<CheckCircle2 className='w-8 h-8 text-teal-400' />}
          />
          <StatsCard
            label='Time Spent'
            value={
              user.session.total_time_spent != null
                ? formatDuration(user.session.total_time_spent)
                : '—'
            }
            icon={<Clock className='w-8 h-8 text-orange-400' />}
          />
        </div>


        {/* Tab Content */}
        <div className='bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100'>
          {!sessionsPage || sessionsPage.data.length === 0 ? (
            <p className='px-6 py-8 text-center text-gray-400 text-sm'>
              No sessions found.
            </p>
          ) : (
            sessionsPage.data.map((session) => (
              <div
                key={session.uuid}
                className='px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'
              >
                <div>
                  <p className='font-semibold text-gray-900'>
                    {session.title}
                  </p>
                  <p className='text-gray-400 text-sm mt-0.5'>
                    {session.end_at ? formatDate(session.end_at) : '—'}
                    {session.duration != null && ` · ${session.duration}m`}
                    {session.score != null && (
                      <span className='ml-2 text-teal-600 font-medium'>
                        Score: {session.score}
                      </span>
                    )}
                  </p>
                </div>
                <div className='flex items-center gap-2 shrink-0'>
                  <button
                    onClick={() =>
                      navigate(
                        ROUTES.ADMIN.SESSION_VIEW.replace(
                          ':sessionId',
                          session.uuid,
                        ),
                        { state: { user, sessionTitle: session.title } },
                      )
                    }
                    className='flex-1 sm:flex-none px-4 py-1.5 rounded-lg border border-orange-600 text-orange-600
                                hover:bg-orange-50 text-sm font-medium transition-colors cursor-pointer'
                  >
                    View Chat
                  </button>
                  <button
                    className='flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg border border-orange-600
                                text-orange-600 hover:bg-orange-50 text-sm font-medium transition-colors cursor-pointer'
                    onClick={() => handleViewReport(session.uuid)}
                  >
                    <FileText className='w-3.5 h-3.5' />
                    View Report
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
