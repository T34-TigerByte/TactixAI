import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import DashboardHeader from '../../components/ui/DashboardHeader.tsx';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';
import PanelHeader from '../../components/ui/PanelHeader';
import { updateLearnerProfileRequest } from '../../api/learner.api';
import { updateProfileSchema, type UpdateProfilePayload } from '../../schemas/profile.schema';

export default function ProfileSettingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfilePayload>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const onSubmit = async (data: UpdateProfilePayload) => {
    await updateLearnerProfileRequest(data);
    navigate(ROUTES.LEARNER.DASHBOARD);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <DashboardHeader
        title='Profile Setting'
        subtitle=''
        onBack={() => navigate(ROUTES.LEARNER.DASHBOARD)}
        onLogout={handleLogout}
      />

      <main className='max-w-3xl mx-auto px-4 sm:px-8 py-8'>
        <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
          <PanelHeader
            icon={<User className='w-5 h-5' aria-hidden='true' />}
            title='Profile Setting'
          />

          <div className='bg-white px-4 sm:px-8 py-6'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='space-y-5'
              noValidate
            >
              {/* First / Last Name */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='profile_first_name'
                    className='block text-sm font-semibold text-gray-800 mb-1'
                  >
                    First Name
                  </label>
                  <input
                    id='profile_first_name'
                    type='text'
                    aria-invalid={!!errors.first_name}
                    aria-describedby={
                      errors.first_name ? 'profile_first_name-error' : undefined
                    }
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none
                               focus:ring-1 ${
                                 errors.first_name
                                   ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                                   : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                               }`}
                    {...register('first_name')}
                  />
                  {errors.first_name && (
                    <p
                      id='profile_first_name-error'
                      role='alert'
                      className='mt-1 text-xs text-red-500'
                    >
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='profile_last_name'
                    className='block text-sm font-semibold text-gray-800 mb-1'
                  >
                    Last Name
                  </label>
                  <input
                    id='profile_last_name'
                    type='text'
                    aria-invalid={!!errors.last_name}
                    aria-describedby={
                      errors.last_name ? 'profile_last_name-error' : undefined
                    }
                    className={`w-full rounded-lg border px-3 py-2 text-sm outline-none
                               focus:ring-1 ${
                                 errors.last_name
                                   ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                                   : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'
                               }`}
                    {...register('last_name')}
                  />
                  {errors.last_name && (
                    <p
                      id='profile_last_name-error'
                      role='alert'
                      className='mt-1 text-xs text-red-500'
                    >
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Email — read only */}
              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-1'>
                  Email
                </label>
                <div
                  className='flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'
                  aria-label={`Email: ${user?.email} (read only)`}
                >
                  <Mail
                    className='w-4 h-4 text-gray-400 shrink-0'
                    aria-hidden='true'
                  />
                  <span className='text-sm text-gray-400'>{user?.email}</span>
                </div>
              </div>

              {/* Change Password */}
              <div className='border-t border-gray-200 pt-1'>
                <p
                  className='text-sm font-semibold text-gray-800 mb-4'
                  id='password-section-label'
                >
                  Change Password
                </p>

                <div
                  className='space-y-4'
                  aria-labelledby='password-section-label'
                >
                  {/* Current Password */}
                  <div>
                    <label
                      htmlFor='current_password'
                      className='block text-sm font-semibold text-gray-800 mb-1'
                    >
                      Current Password
                    </label>
                    <div
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2
                                    focus-within:ring-1 ${
                                      errors.current_password
                                        ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400'
                                        : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-500'
                                    }`}
                    >
                      <Lock
                        className='w-4 h-4 text-gray-400 shrink-0'
                        aria-hidden='true'
                      />
                      <input
                        id='current_password'
                        type='password'
                        placeholder='Enter current password'
                        aria-invalid={!!errors.current_password}
                        aria-describedby={
                          errors.current_password
                            ? 'current_password-error'
                            : undefined
                        }
                        className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                        {...register('current_password')}
                      />
                    </div>
                    {errors.current_password && (
                      <p
                        id='current_password-error'
                        role='alert'
                        className='mt-1 text-xs text-red-500'
                      >
                        {errors.current_password.message}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      htmlFor='new_password'
                      className='block text-sm font-semibold text-gray-800 mb-1'
                    >
                      New Password
                    </label>
                    <div
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2
                                    focus-within:ring-1 ${
                                      errors.new_password
                                        ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400'
                                        : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-500'
                                    }`}
                    >
                      <Lock
                        className='w-4 h-4 text-gray-400 shrink-0'
                        aria-hidden='true'
                      />
                      <input
                        id='new_password'
                        type='password'
                        placeholder='Enter new password'
                        aria-invalid={!!errors.new_password}
                        aria-describedby={
                          errors.new_password ? 'new_password-error' : undefined
                        }
                        className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                        {...register('new_password')}
                      />
                    </div>
                    {errors.new_password && (
                      <p
                        id='new_password-error'
                        role='alert'
                        className='mt-1 text-xs text-red-500'
                      >
                        {errors.new_password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label
                      htmlFor='new_password_confirmation'
                      className='block text-sm font-semibold text-gray-800 mb-1'
                    >
                      Confirm New Password
                    </label>
                    <div
                      className={`flex items-center gap-2 border rounded-lg px-3 py-2
                                    focus-within:ring-1 ${
                                      errors.new_password_confirmation
                                        ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400'
                                        : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-500'
                                    }`}
                    >
                      <Lock
                        className='w-4 h-4 text-gray-400 shrink-0'
                        aria-hidden='true'
                      />
                      <input
                        id='new_password_confirmation'
                        type='password'
                        placeholder='Confirm new password'
                        aria-invalid={!!errors.new_password_confirmation}
                        aria-describedby={
                          errors.new_password_confirmation
                            ? 'new_password_confirmation-error'
                            : undefined
                        }
                        className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                        {...register('new_password_confirmation')}
                      />
                    </div>
                    {errors.new_password_confirmation && (
                      <p
                        id='new_password_confirmation-error'
                        role='alert'
                        className='mt-1 text-xs text-red-500'
                      >
                        {errors.new_password_confirmation.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <button
                type='submit'
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className='w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                           bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium
                           transition-colors cursor-pointer'
              >
                <Save className='w-4 h-4' aria-hidden='true' />
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
