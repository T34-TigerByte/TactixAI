import { User, Mail, Building2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { AdminUserListItem } from '../../schemas/api.schema';
import { updateUserSchema, type UpdateUserPayload } from '../../schemas/user.schema';
import { updateUserRequest } from '../../api/admin.api';
import { splitName } from '../../utils/format.utils';
import PanelHeader from '../ui/PanelHeader';

interface Props {
  user: AdminUserListItem;
  onBack: () => void;
}

export default function EditUserForm({ user, onBack }: Props) {
  const { first, last } = splitName(user.name);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateUserPayload>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { first_name: first, last_name: last },
  });

  const onSubmit = async (data: UpdateUserPayload) => {
    await updateUserRequest(user.id, data);
    onBack();
  };

  return (
    <div className='rounded-xl overflow-hidden border border-gray-200 shadow-sm'>
      <PanelHeader icon={<User className='w-5 h-5' aria-hidden='true' />} title='Edit User Profile' />

      <div className='bg-white px-8 py-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5' noValidate>
          {/* First Name */}
          <div>
            <label htmlFor='edit_first_name' className='block text-sm font-semibold text-gray-800 mb-1'>
              First Name
            </label>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-2
                            focus-within:ring-1 ${errors.first_name
                ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400'
                : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-500'}`}>
              <User className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
              <input
                id='edit_first_name'
                type='text'
                aria-invalid={!!errors.first_name}
                aria-describedby={errors.first_name ? 'edit_first_name-error' : undefined}
                className='flex-1 text-sm outline-none text-gray-700 bg-transparent'
                {...register('first_name')}
              />
            </div>
            {errors.first_name && (
              <p id='edit_first_name-error' role='alert' className='mt-1 text-xs text-red-500'>
                {errors.first_name.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor='edit_last_name' className='block text-sm font-semibold text-gray-800 mb-1'>
              Last Name
            </label>
            <div className={`flex items-center gap-2 border rounded-lg px-3 py-2
                            focus-within:ring-1 ${errors.last_name
                ? 'border-red-400 focus-within:border-red-400 focus-within:ring-red-400'
                : 'border-gray-300 focus-within:border-orange-500 focus-within:ring-orange-500'}`}>
              <User className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
              <input
                id='edit_last_name'
                type='text'
                aria-invalid={!!errors.last_name}
                aria-describedby={errors.last_name ? 'edit_last_name-error' : undefined}
                className='flex-1 text-sm outline-none text-gray-700 bg-transparent'
                {...register('last_name')}
              />
            </div>
            {errors.last_name && (
              <p id='edit_last_name-error' role='alert' className='mt-1 text-xs text-red-500'>
                {errors.last_name.message}
              </p>
            )}
          </div>

          {/* Email — read only */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-1'>Email Address</label>
            <div
              className='flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'
              aria-label={`Email: ${user.email} (read only)`}
            >
              <Mail className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
              <span className='text-sm text-gray-400'>{user.email}</span>
            </div>
          </div>

          {/* Company — read only */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-1'>Company</label>
            <div
              className='flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'
              aria-label={`Company: ${user.company} (read only)`}
            >
              <Building2 className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
              <span className='text-sm text-gray-400'>{user.company}</span>
            </div>
          </div>

          {/* User Role — read only */}
          <div>
            <label className='block text-sm font-semibold text-gray-800 mb-1'>User Role</label>
            <div
              className='flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50'
              aria-label='User Role: Learner (read only)'
            >
              <User className='w-4 h-4 text-gray-400 shrink-0' aria-hidden='true' />
              <span className='text-sm text-gray-400'>Learner</span>
            </div>
          </div>

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
  );
}
