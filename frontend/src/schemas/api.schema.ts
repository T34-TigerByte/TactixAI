import { z } from 'zod';

/* Auth */
export const authResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

export const userSchema = z.object({
  id: z.number().optional(),
  role: z.enum(['admin', 'learner']),
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  company: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

/* Admin */
export const adminStatsSchema = z.object({
  total_users: z.number(),
  active_learners: z.number(),
  total_sessions: z.number(),
  uptime: z.number(),
});

const userSessionSchema = z.object({
  completed: z.number(),
  last_session_at: z.number().nullable(),
  total_time_spent: z.number(),
});

export const adminUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  joined_at: z.number(),
  company: z.string(),
  session: userSessionSchema,
});

export const adminUserByIdSchema = z.object({
  email: z.email(),
  joined_at: z.number(),
  company: z.string(),
  session: userSessionSchema,
});

export const adminUserListSchema = z.array(adminUserSchema);

/* Learner */
export const learnerProfileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  role: z.string(),
});

export const learnerSessionSchema = z.object({
  total: z.number(),
  average_score: z.number(),
  total_hours: z.number(),
  current_streak: z.number().optional(),
});

export const learnerProgressSchema = z.object({
  communication: z.number(),
  negotication: z.number(),
  risk_management: z.number(),
});

export const learnerStatsSchema = z.object({
  session: learnerSessionSchema,
  progress: learnerProgressSchema,
});

// PUT /profile response — Assume BE server returns updated profile data
export const updateProfileResponseSchema = learnerProfileSchema;

/* Inferred Types */
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type User = z.infer<typeof userSchema>;
export type AdminStats = z.infer<typeof adminStatsSchema>;
export type AdminUserListItem = z.infer<typeof adminUserSchema>;
export type AdminUserById = z.infer<typeof adminUserByIdSchema>;
export type LearnerProfile = z.infer<typeof learnerProfileSchema>;
export type LearnerSession = z.infer<typeof learnerSessionSchema>;
export type LearnerProgress = z.infer<typeof learnerProgressSchema>;
export type LearnerStats = z.infer<typeof learnerStatsSchema>;
