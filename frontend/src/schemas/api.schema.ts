import { z } from 'zod';

/* Shared */
export const paginationSchema = z.object({
  next_cursor: z.string().nullable(),
  prev_cursor: z.string().nullable(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
  limit: z.number(),
});

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
  active_users: z.number(),
  user_growth_percentage: z.number(),
  total_sessions: z.number(),
  session_growth_percentage: z.number(),
});

const userSessionSchema = z.object({
  completed: z.number(),
  last_session_at: z.number().nullish(),
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

export const adminUserListPageSchema = z.object({
  total: z.number(),
  pagination: paginationSchema,
  data: z.array(adminUserSchema),
});

/* Learner */

export const learnerProfileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  role: z.string(),
});

export const learnerSessionSchema = z.object({
  total: z.number(),
  average_score: z.number().optional(),
  total_hours: z.number(),
  current_streak: z.number().optional(),
});

export const learnerProgressSchema = z.object({
  communication: z.number().nullable(),
  negotiation: z.number().nullable(),
  risk_management: z.number().nullable(),
  scenarios: z.object({
    total: z.number(),
    completed: z.number()
  })
});

export const learnerStatsSchema = z.object({
  session: learnerSessionSchema,
  progress: learnerProgressSchema,
});

export const learnerActivityMetaDataSchema = z.object({
  role: z.string().optional(),
  scenario_title: z.string().optional()
});

export const learnerActivitySchema = z.object({
  user_name: z.string(),
  created_at: z.number(),
  type: z.string(),
  metadata: learnerActivityMetaDataSchema,
});

export const adminActivitiesPageSchema = z.object({
  total: z.number(),
  pagination: paginationSchema,
  data: z.array(learnerActivitySchema),
});

export const learnerChatSchema = z.object({
  content: z.string(),
  session_id: z.uuid()
})


export const learnerScenarioSchema = z.object({
  uuid: z.uuid(),
  title: z.string(),
  description: z.string(),
  // difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  time_estimate: z.number(),
  // objectives: z.number(),
  industry: z.string().optional(),
  threat_actor: z.string(), // TO BE: Replaced by a threat_actor obj type
});

export const scenarioPageSchema = z.object({
  total: z.number(),
  pagination: paginationSchema,
  data: z.array(learnerScenarioSchema),
});

/* Session */

export const sessionStartSchema = z.object({
  id: z.uuid(),
});

const sessionOptionSchema = z.object({
  title: z.string(),
  answer_key: z.string(),
});

const sessionQuestionSchema = z.object({
  title: z.string(),
  question_key: z.string(),
  options: z.array(sessionOptionSchema),
});

export const sessionDetailsSchema = z.object({
  time_estimate: z.number(),
  system_message: z.string().optional(),
  questions: z.array(sessionQuestionSchema),
});

export const sessionSummarySchema = z.object({
  title: z.string(),
  start_at: z.number().nullable(),
  end_at: z.number().nullable(),
  evaluation: z.object({
    initial_ransom: z.number().nullable(),
    min_ransom: z.number().nullable(),
    initial_deadline: z.number().nullable(),
    min_deadline: z.number().nullable(),
  }).nullable(),
});

export const sessionListItemSchema = z.object({
  uuid: z.uuid(),
  title: z.string(),
  end_at: z.number().nullable(),
  duration: z.number().nullable(),
});

export const sessionListPageSchema = z.object({
  total: z.number(),
  pagination: paginationSchema,
  data: z.array(sessionListItemSchema),
});

export const chatMessageSchema = z.object({
  sender: z.enum(['user', 'system', 'ai_model']),
  message: z.string(),
  sent_at: z.number(),
});

export const chatMessagesPageSchema = z.object({
  total: z.number(),
  pagination: paginationSchema,
  data: z.array(chatMessageSchema),
});

/* DEFINE SESSION SCHEMA */

// PUT /profile response — Assume BE server returns updated profile data
export const updateProfileResponseSchema = learnerProfileSchema;

/* Inferred Types */
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type User = z.infer<typeof userSchema>;

/* admin page*/

export type AdminStats = z.infer<typeof adminStatsSchema>;
export type AdminUserListItem = z.infer<typeof adminUserSchema>;
export type AdminUserById = z.infer<typeof adminUserByIdSchema>;
export type AdminUserListPage = z.infer<typeof adminUserListPageSchema>;
export type AdminActivitiesPage = z.infer<typeof adminActivitiesPageSchema>;
export type CursorPagination = z.infer<typeof paginationSchema>;

/* learner page*/

export type LearnerProfile = z.infer<typeof learnerProfileSchema>;
export type LearnerSession = z.infer<typeof learnerSessionSchema>;
export type LearnerProgress = z.infer<typeof learnerProgressSchema>;
export type LearnerStats = z.infer<typeof learnerStatsSchema>;
export type LearnerScenario = z.infer<typeof learnerScenarioSchema>;
export type LearnerActivity = z.infer<typeof learnerActivitySchema>;
export type ScenarioPage = z.infer<typeof scenarioPageSchema>;
export type SessionStart = z.infer<typeof sessionStartSchema>;
export type SessionDetails = z.infer<typeof sessionDetailsSchema>;
export type SessionSummary = z.infer<typeof sessionSummarySchema>;
export type SessionListItem = z.infer<typeof sessionListItemSchema>;
export type SessionListPage = z.infer<typeof sessionListPageSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatMessagesPage = z.infer<typeof chatMessagesPageSchema>;