import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    current_password: z.string().optional(),
    new_password: z
      .string()
      .min(10, 'Password must be at least 10 characters')
      .optional(),
    new_password_confirmation: z
      .string()
      .min(10, 'Password must be at least 10 characters')
      .optional(),
  })
  .superRefine((data, ctx) => {
    const anyPasswordField =
      data.current_password ||
      data.new_password ||
      data.new_password_confirmation;

    if (anyPasswordField) {
      if (!data.current_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['current_password'],
          message: 'Current password is required',
        });
      }
      if (!data.new_password) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['new_password'],
          message: 'New password is required',
        });
      }
      if (data.new_password && data.new_password.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['new_password'],
          message: 'Password must be at least 10 characters',
        });
      }
      if (data.new_password !== data.new_password_confirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['new_password_confirmation'],
          message: 'Passwords do not match',
        });
      }
    }
  });

export type UpdateProfilePayload = z.infer<typeof updateProfileSchema>;
