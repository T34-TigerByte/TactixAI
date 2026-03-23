import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { User, Mail, Building2, UserPlus } from 'lucide-react';

import type { CreateUserPayload } from '../../types/admin.types';
import { createUserRequest } from '../../api/admin.api';

interface Props {
  onBack: () => void;
}

export default function CreateUserForm({ onBack }: Props) {
  const [formData, setFormData] = useState<CreateUserPayload>({
    first_name: '',
    last_name: '',
    email: '',
    role: 'learner',
    company: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: await createUserRequest(formData);
    await createUserRequest(formData);
    onBack();
  };

  return (
    <div className='space-y-4'>
      {/* Form Card */}
      <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
        {/* Card Header */}
        <div className='bg-slate-900 px-6 py-4 flex items-center gap-2'>
          <UserPlus className='w-5 h-5 text-teal-400' />
          <h3 className='text-white font-semibold'>User Information</h3>
        </div>

        {/* Card Body */}
        <div className='bg-white px-8 py-6'>
          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* First Name */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>
                First Name <span className='text-red-500'>*</span>
              </label>
              <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                              focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
                <User className='w-4 h-4 text-gray-400 shrink-0' />
                <input
                  type='text'
                  name='first_name'
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter user's first name"
                  required
                  className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>
                Last Name <span className='text-red-500'>*</span>
              </label>
              <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                              focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
                <User className='w-4 h-4 text-gray-400 shrink-0' />
                <input
                  type='text'
                  name='last_name'
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter user's last name"
                  required
                  className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>
                Email Address <span className='text-red-500'>*</span>
              </label>
              <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                              focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
                <Mail className='w-4 h-4 text-gray-400 shrink-0' />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='user@company.com'
                  required
                  className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                />
              </div>
              <p className='mt-1 text-xs text-gray-500'>An invitation email will be sent to this address</p>
            </div>

            {/* Company */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>
                Company <span className='text-red-500'>*</span>
              </label>
              <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                              focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
                <Building2 className='w-4 h-4 text-gray-400 shrink-0' />
                <input
                  type='text'
                  name='company'
                  value={formData.company}
                  onChange={handleChange}
                  placeholder='Enter company name'
                  required
                  className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                />
              </div>
            </div>

            {/* User Role */}
            <div>
              <label className='block text-sm font-semibold text-gray-800 mb-1'>
                User Role <span className='text-red-500'>*</span>
              </label>
              <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                              focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
                <User className='w-4 h-4 text-teal-500 shrink-0' />
                <select
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className='flex-1 text-sm outline-none text-gray-700 bg-transparent cursor-pointer appearance-none'
                >
                  <option value='learner'>Learner</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className='border-t border-gray-200 pt-4'>
              <div className='flex gap-3'>
                <button
                  type='submit'
                  className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                             bg-red-600 hover:bg-red-700 text-white text-sm font-medium
                             transition-colors cursor-pointer'
                >
                  <UserPlus className='w-4 h-4' />
                  Create User
                </button>
                <button
                  type='button'
                  onClick={onBack}
                  className='flex-1 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50
                             text-gray-800 text-sm font-medium transition-colors cursor-pointer'
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Invitation Process Info */}
      <div className='rounded-xl bg-teal-50 border border-teal-100 px-6 py-4 flex gap-4'>
        <div className='shrink-0 mt-0.5'>
          <Mail className='w-5 h-5 text-teal-500' />
        </div>
        <div>
          <p className='text-sm font-semibold text-gray-800'>Invitation Process</p>
          <p className='text-sm text-gray-600 mt-0.5'>
            Once you create a user, they will receive an email invitation to set up their account.
            The invitation link will be valid for 7 days. New users will need to create a password before
            they can access the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
