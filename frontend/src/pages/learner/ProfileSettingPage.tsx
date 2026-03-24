import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, LogOut, Save, ArrowLeft } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../router/routes';
import Logo from '../../components/ui/Logo';
import PanelHeader from '../../components/ui/PanelHeader';
import { updateLearnerProfileRequest } from '../../api/learner.api';
import type { UpdateProfilePayload } from '../../types/learner.types';

export default function ProfileSettingPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState({ first_name: user.first_name, last_name: user.last_name });
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: UpdateProfilePayload = {
      first_name: profile.first_name,
      last_name: profile.last_name,
      ...(passwords.current_password && {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
        new_password_confirmation: passwords.new_password_confirmation,
      }),
    };
    await updateLearnerProfileRequest(user!.id, payload);
    navigate(ROUTES.LEARNER.DASHBOARD);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <header className='bg-slate-900 px-8 py-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => navigate(ROUTES.LEARNER.DASHBOARD)}
              className='flex items-center gap-2 px-4 py-2 rounded-lg
                         border border-red-400 text-red-400
                         hover:border-red-600 hover:text-red-600
                         transition-colors text-sm font-medium cursor-pointer'
            >
              <ArrowLeft className='w-4 h-4' />
              Back
            </button>
            <Logo />
            <div className='h-6 w-px bg-slate-600' />
            <h1 className='text-white font-bold text-lg'>Profile Setting</h1>
          </div>
          <button
            onClick={handleLogout}
            className='flex items-center gap-2 px-4 py-2 rounded-lg
                       border border-red-400 text-red-400
                       hover:border-red-600 hover:text-red-600
                       transition-colors text-sm font-medium cursor-pointer'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </button>
        </div>
      </header>

      <main className='max-w-3xl mx-auto px-8 py-8'>
        <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
          <PanelHeader icon={<User className='w-5 h-5' />} title='Profile Setting' />

          {/* Card Body */}
          <div className='bg-white px-8 py-6'>
            <form onSubmit={handleSubmit} className='space-y-5'>
              {/* First / Last Name */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-semibold text-gray-800 mb-1'>First Name</label>
                  <input
                    type='text'
                    name='first_name'
                    value={profile.first_name}
                    onChange={handleProfileChange}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                               outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-semibold text-gray-800 mb-1'>Last Name</label>
                  <input
                    type='text'
                    name='last_name'
                    value={profile.last_name}
                    onChange={handleProfileChange}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                               outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
                  />
                </div>
              </div>

              {/* Email — read only */}
              <div>
                <label className='block text-sm font-semibold text-gray-800 mb-1'>Email</label>
                <div className='flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'>
                  <Mail className='w-4 h-4 text-gray-400 shrink-0' />
                  <span className='text-sm text-gray-400'>{user?.email}</span>
                </div>
              </div>

              {/* Divider */}
              <div className='border-t border-gray-200 pt-1'>
                <p className='text-sm font-semibold text-gray-800 mb-4'>Change Password</p>

                <div className='space-y-4'>
                  {/* Current Password */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-800 mb-1'>Current Password</label>
                    <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                                    focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
                      <Lock className='w-4 h-4 text-gray-400 shrink-0' />
                      <input
                        type='password'
                        name='current_password'
                        value={passwords.current_password}
                        onChange={handlePasswordChange}
                        placeholder='Enter current password'
                        className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-800 mb-1'>New Password</label>
                    <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                                    focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
                      <Lock className='w-4 h-4 text-gray-400 shrink-0' />
                      <input
                        type='password'
                        name='new_password'
                        value={passwords.new_password}
                        onChange={handlePasswordChange}
                        placeholder='Enter new password'
                        className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                      />
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className='block text-sm font-semibold text-gray-800 mb-1'>Confirm New Password</label>
                    <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                                    focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
                      <Lock className='w-4 h-4 text-gray-400 shrink-0' />
                      <input
                        type='password'
                        name='new_password_confirmation'
                        value={passwords.new_password_confirmation}
                        onChange={handlePasswordChange}
                        placeholder='Confirm new password'
                        className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <button
                type='submit'
                className='w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
                           bg-red-600 hover:bg-red-700 text-white text-sm font-medium
                           transition-colors cursor-pointer'
              >
                <Save className='w-4 h-4' />
                Update
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
