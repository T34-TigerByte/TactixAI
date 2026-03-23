import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { User } from 'lucide-react';

import type { AdminUserListItem, UpdateUserPayload } from '../../types/admin.types';
import { updateUserRequest } from '../../api/admin.api';

interface Props {
  user: AdminUserListItem;
  onBack: () => void;
}

function splitName(fullName: string): { first: string; last: string } {
  const idx = fullName.indexOf(' ');
  if (idx === -1) return { first: fullName, last: '' };
  return { first: fullName.slice(0, idx), last: fullName.slice(idx + 1) };
}

export default function EditUserForm({ user, onBack }: Props) {
  const { first, last } = splitName(user.name);
  const [formData, setFormData] = useState<UpdateUserPayload>({
    first_name: first,
    last_name: last,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await updateUserRequest(user.id, formData);
    onBack();
  };

  return (
    <div className='space-y-4'>
      {/* Form Card */}
      <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
        {/* Card Header */}
        <div className='bg-slate-900 px-6 py-4 flex items-center gap-2'>
          <User className='w-5 h-5 text-teal-400' />
          <h3 className='text-white font-semibold'>Edit User Profile</h3>
        </div>

        {/* Card Body */}
        <div className='bg-white px-8 py-6'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* First Name */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>First Name</label>
              <input
                type='text'
                name='first_name'
                value={formData.first_name}
                onChange={handleChange}
                required
                className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                           outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
              />
            </div>

            {/* Last Name */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>Last Name</label>
              <input
                type='text'
                name='last_name'
                value={formData.last_name}
                onChange={handleChange}
                className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                           outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500'
              />
            </div>

            {/* Email Address — read only */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>Email Address</label>
              <input
                type='email'
                value={user.email}
                disabled
                placeholder={user.email}
                className='w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
                           text-gray-400 bg-gray-50 cursor-not-allowed'
              />
            </div>

            {/* Company — read only */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>Company</label>
              <input
                type='text'
                value={user.company}
                disabled
                placeholder={user.company}
                className='w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
                           text-gray-400 bg-gray-50 cursor-not-allowed'
              />
            </div>

            {/* User Role — read only */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>User Role</label>
              <input
                type='text'
                value='Learner'
                disabled
                className='w-full rounded-lg border border-gray-200 px-3 py-2 text-sm
                           text-gray-400 bg-gray-50 cursor-not-allowed'
              />
            </div>

            {/* Update Button */}
            <button
              type='submit'
              className='w-full py-2.5 rounded-lg bg-red-600 hover:bg-red-700
                         text-white text-sm font-medium transition-colors cursor-pointer'
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}