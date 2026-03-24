import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { User, Mail, Building2, Save } from 'lucide-react';

import type { AdminUserListItem, UpdateUserPayload } from '../../types/admin.types';
import { updateUserRequest } from '../../api/admin.api';
import { splitName } from '../../utils/format.utils';
import PanelHeader from '../ui/PanelHeader';

interface Props {
  user: AdminUserListItem;
  onBack: () => void;
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
    <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
      <PanelHeader icon={<User className='w-5 h-5' />} title='Edit User Profile' />

      <div className='bg-white px-8 py-6'>
        <form onSubmit={handleSubmit} className='space-y-5'>
          {/* First Name */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-1'>First Name</label>
            <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                            focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
              <User className='w-4 h-4 text-gray-400 shrink-0' />
              <input
                type='text'
                name='first_name'
                value={formData.first_name}
                onChange={handleChange}
                required
                className='flex-1 text-sm outline-none text-gray-700 bg-transparent'
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-1'>Last Name</label>
            <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                            focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
              <User className='w-4 h-4 text-gray-400 shrink-0' />
              <input
                type='text'
                name='last_name'
                value={formData.last_name}
                onChange={handleChange}
                className='flex-1 text-sm outline-none text-gray-700 bg-transparent'
              />
            </div>
          </div>

          {/* Email — read only */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-1'>Email Address</label>
            <div className='flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'>
              <Mail className='w-4 h-4 text-gray-400 shrink-0' />
              <span className='text-sm text-gray-400'>{user.email}</span>
            </div>
          </div>

          {/* Company — read only */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-1'>Company</label>
            <div className='flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'>
              <Building2 className='w-4 h-4 text-gray-400 shrink-0' />
              <span className='text-sm text-gray-400'>{user.company}</span>
            </div>
          </div>

          {/* User Role — read only */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-1'>User Role</label>
            <div className='flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'>
              <User className='w-4 h-4 text-gray-400 shrink-0' />
              <span className='text-sm text-gray-400'>Learner</span>
            </div>
          </div>

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
  );
}
