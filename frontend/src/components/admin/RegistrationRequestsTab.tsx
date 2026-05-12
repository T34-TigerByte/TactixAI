import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

import {
  getRegistrationRequestsRequest,
  approveRegistrationRequestRequest,
  rejectRegistrationRequestRequest,
} from '../../api/admin.api';
import { formatTimestamp } from '../../utils/format.utils';

const STATUS_TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
] as const;

type StatusFilter = (typeof STATUS_TABS)[number]['key'];

export default function RegistrationRequestsTab() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [confirmAction, setConfirmAction] = useState<{ id: number; type: 'approve' | 'reject' } | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'registration-requests', statusFilter],
    queryFn: () => getRegistrationRequestsRequest(statusFilter),
  });

  const onActionSuccess = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin', 'registration-requests'] });
    setConfirmAction(null);
  }, [queryClient]);

  const approveMutation = useMutation({
    mutationFn: (id: number) => approveRegistrationRequestRequest(id),
    onSuccess: onActionSuccess,
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectRegistrationRequestRequest(id),
    onSuccess: onActionSuccess,
  });

  return (
    <div className='space-y-4'>
      {/* Status filter tabs */}
      <div className='bg-white rounded-xl border border-gray-200 shadow-sm'>
        <div className='flex border-b border-gray-200 px-4 pt-4 gap-1'>
          {STATUS_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors cursor-pointer
                ${statusFilter === key
                  ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={refetch}
            className='ml-auto mb-2 flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
          >
            <RefreshCw className='w-3.5 h-3.5' />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          {isLoading ? (
            <div className='flex justify-center items-center py-16 text-gray-400 text-sm'>Loading...</div>
          ) : isError ? (
            <div className='flex justify-center items-center py-16 text-red-500 text-sm'>Failed to load requests.</div>
          ) : !data?.data.length ? (
            <div className='flex flex-col items-center justify-center py-16 text-gray-400 text-sm gap-2'>
              <Clock className='w-8 h-8 opacity-40' />
              <span>No {statusFilter} requests</span>
            </div>
          ) : (
            <table className='w-full text-sm'>
              <thead>
                <tr className='text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100'>
                  <th className='px-6 py-3 font-medium'>Name</th>
                  <th className='px-6 py-3 font-medium'>Email</th>
                  <th className='px-6 py-3 font-medium'>Company</th>
                  <th className='px-6 py-3 font-medium'>Submitted</th>
                  {statusFilter !== 'pending' && (
                    <th className='px-6 py-3 font-medium'>Reviewed</th>
                  )}
                  {statusFilter === 'pending' && (
                    <th className='px-6 py-3 font-medium'>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {data.data.map((req) => (
                  <tr key={req.id} className='hover:bg-gray-50 transition-colors'>
                    <td className='px-6 py-4 font-medium text-gray-900'>
                      {req.first_name} {req.last_name}
                    </td>
                    <td className='px-6 py-4 text-gray-600'>{req.email}</td>
                    <td className='px-6 py-4 text-gray-600'>{req.company ?? '—'}</td>
                    <td className='px-6 py-4 text-gray-500'>
                      {req.created_at ? formatTimestamp(req.created_at) : '—'}
                    </td>
                    {statusFilter !== 'pending' && (
                      <td className='px-6 py-4 text-gray-500'>
                        {req.reviewed_at ? formatTimestamp(req.reviewed_at) : '—'}
                      </td>
                    )}
                    {statusFilter === 'pending' && (
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => setConfirmAction({ id: req.id, type: 'approve' })}
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium
                                       hover:bg-green-100 transition-colors cursor-pointer border border-green-200'
                          >
                            <CheckCircle className='w-3.5 h-3.5' />
                            Approve
                          </button>
                          <button
                            onClick={() => setConfirmAction({ id: req.id, type: 'reject' })}
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium
                                       hover:bg-red-100 transition-colors cursor-pointer border border-red-200'
                          >
                            <XCircle className='w-3.5 h-3.5' />
                            Decline
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data && (
          <div className='px-6 py-3 border-t border-gray-100 text-xs text-gray-400'>
            {data.total} request{data.total !== 1 ? 's' : ''} total
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {confirmAction && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
          <div className='bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm space-y-4'>
            <div className='space-y-1'>
              <h3 className='font-semibold text-gray-900 text-base'>
                {confirmAction.type === 'approve' ? 'Approve request?' : 'Decline request?'}
              </h3>
              <p className='text-sm text-gray-500'>
                {confirmAction.type === 'approve'
                  ? 'A user account will be created and a set-password email will be sent.'
                  : 'The applicant will be notified that their request was declined.'}
              </p>
            </div>
            <div className='flex justify-end gap-2'>
              <button
                onClick={() => setConfirmAction(null)}
                className='px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer'
              >
                Cancel
              </button>
              <button
                disabled={approveMutation.isPending || rejectMutation.isPending}
                onClick={() => {
                  if (confirmAction.type === 'approve') {
                    approveMutation.mutate(confirmAction.id);
                  } else {
                    rejectMutation.mutate(confirmAction.id);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${confirmAction.type === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {approveMutation.isPending || rejectMutation.isPending
                  ? 'Processing...'
                  : confirmAction.type === 'approve' ? 'Approve' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
