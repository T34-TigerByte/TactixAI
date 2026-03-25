import { User, Mail, Building2, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createUserSchema, type CreateUserPayload } from '../../schemas/user.schema';
import { createUserRequest } from '../../api/admin.api';
import PanelHeader from '../ui/PanelHeader';

interface Props {
  onBack: () => void;
}

export default function CreateUserForm({ onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserPayload>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: 'learner' },
  });

  const onSubmit = async (data: CreateUserPayload) => {
    await createUserRequest(data);
    onBack();
  };

  return (
    <div className='space-y-4'>
      <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
        <PanelHeader icon={<UserPlus className='w-5 h-5' aria-hidden='true' />} title='User Information' />

        <div className='bg-white px-8 py-6'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-5' noValidate>
            {/* First Name */}
            <div>
              <label htmlFor='first_name' className='block text-sm font-semibold text-gray-800 mb-1'>
                First Name <span aria-hidden='true' className='text-red-500'>*</span>
              </label>
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2
                              focus-within:ring-1 ${errors.first_name
                  ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400'
                  : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-500'}`}>
                <User className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
                <input
                  id='first_name'
                  type='text'
                  placeholder="Enter user's first name"
                  aria-invalid={!!errors.first_name}
                  aria-describedby={errors.first_name ? 'first_name-error' : undefined}
                  className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                  {...register('first_name')}
                />
              </div>
              {errors.first_name && (
                <p id='first_name-error' role='alert' className='mt-1 text-xs text-red-500'>
                  {errors.first_name.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor='last_name' className='block text-sm font-semibold text-gray-800 mb-1'>
                Last Name <span aria-hidden='true' className='text-red-500'>*</span>
              </label>
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2
                              focus-within:ring-1 ${errors.last_name
                  ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400'
                  : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-500'}`}>
                <User className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
                <input
                  id='last_name'
                  type='text'
                  placeholder="Enter user's last name"
                  aria-invalid={!!errors.last_name}
                  aria-describedby={errors.last_name ? 'last_name-error' : undefined}
                  className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                  {...register('last_name')}
                />
              </div>
              {errors.last_name && (
                <p id='last_name-error' role='alert' className='mt-1 text-xs text-red-500'>
                  {errors.last_name.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor='email' className='block text-sm font-semibold text-gray-800 mb-1'>
                Email Address <span aria-hidden='true' className='text-red-500'>*</span>
              </label>
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2
                              focus-within:ring-1 ${errors.email
                  ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400'
                  : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-500'}`}>
                <Mail className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
                <input
                  id='email'
                  type='email'
                  placeholder='user@company.com'
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : 'email-hint'}
                  className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                  {...register('email')}
                />
              </div>
              {errors.email
                ? <p id='email-error' role='alert' className='mt-1 text-xs text-red-500'>{errors.email.message}</p>
                : <p id='email-hint' className='mt-1 text-xs text-gray-500'>An invitation email will be sent to this address</p>
              }
            </div>

            {/* Company */}
            <div>
              <label htmlFor='company' className='block text-sm font-semibold text-gray-800 mb-1'>
                Company <span aria-hidden='true' className='text-red-500'>*</span>
              </label>
              <div className={`flex items-center gap-2 border rounded-lg px-3 py-2
                              focus-within:ring-1 ${errors.company
                  ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400'
                  : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-500'}`}>
                <Building2 className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
                <input
                  id='company'
                  type='text'
                  placeholder='Enter company name'
                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? 'company-error' : undefined}
                  className='flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent'
                  {...register('company')}
                />
              </div>
              {errors.company && (
                <p id='company-error' role='alert' className='mt-1 text-xs text-red-500'>
                  {errors.company.message}
                </p>
              )}
            </div>

            {/* User Role */}
            <div>
              <label htmlFor='role' className='block text-sm font-semibold text-gray-800 mb-1'>
                User Role <span aria-hidden='true' className='text-red-500'>*</span>
              </label>
              <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2
                              focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500'>
                <User className='w-4 h-4 text-teal-500 shrink-0' aria-hidden='true' />
                <select
                  id='role'
                  className='flex-1 text-sm outline-none text-gray-700 bg-transparent cursor-pointer appearance-none'
                  {...register('role')}
                >
                  <option value='learner'>Learner</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>
            </div>

            <div className='border-t border-gray-200 pt-4 flex gap-3'>
              <button
                type='submit'
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                           bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium
                           transition-colors cursor-pointer'
              >
                <UserPlus className='w-4 h-4' aria-hidden='true' />
                {isSubmitting ? 'Creating...' : 'Create User'}
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
          </form>
        </div>
      </div>

      {/* Invitation Process Info */}
      <div className='rounded-xl bg-teal-50 border border-teal-100 px-6 py-4 flex gap-4'>
        <Mail className='w-5 h-5 text-teal-500 shrink-0 mt-0.5' aria-hidden='true' />
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
