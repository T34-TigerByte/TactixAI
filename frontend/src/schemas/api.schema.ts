import { z } from 'zod';

/* Auth */
export const authResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
});

/* Refresh */
export const refreshResponseSchema = z.object({
  access_token: z.string(),
});

export const apiErrorSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
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

export const validationErrorsSchema = z.object({
  errors: z.record(z.string(), z.array(z.string())),
});

/* Admin */
export const adminStatsSchema = z.object({
  total_users: z.number(),
  active_users: z.number(),
  user_growth_percentage: z.number(),
  // active_learners:z.number(),
  total_sessions: z.number(),
  session_growth_percentage: z.number(),
  // uptime: z.number(),
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
  //progress: learnerProgressSchema,
});

export const adminUserListSchema = z.array(adminUserSchema);

/* User growth in admin dashboard */
export const userGrowthSchema = z.object({
  month: z.string(),
  learners: z.number()
});

/* Platform usage in admin dashboard */
export const platformUsageSchema = z.object({
  daily_active_users: z.number(),
  sessions_per_user: z.number(),
});

export const adminAnalyticsSchema = z.object({
  user_growth: z.array(userGrowthSchema),
  platform_usage: platformUsageSchema
});

/* Session evaluation */
export const adminSessionSummaryEvaluationSchema = z.object({
  time_extended: z.boolean(),
  ransom_reduced: z.boolean(),
  initial_ransom_amount: z.number(),
  final_ransom_amount: z.number(),
  decryption_key_requested: z.boolean(),
  data_exploitation_discussed: z.boolean(),
});

export const adminSessionSummarySchema = z.object({
  title: z.string(),
  start_at: z.number(),
  end_at: z.number(),
  evaluation: adminSessionSummaryEvaluationSchema,
});

/* Session message & query */
export const adminSessionMessagesQuerySchema = z.object({
  per_page: z.number().int().min(1).max(50).optional(),
  cursor: z.string().nullable().optional(),
});

export const adminSessionMessageItemSchema = z.object({
  sender: z.enum(['user', 'system', 'ai_model']),
  message: z.string(),
  sent_at: z.number(),
});

export const cursorPaginationSchema = z.object({
  next_cursor: z.string().nullable(),
  prev_cursor: z.string().nullable(),
  has_next: z.boolean(),
  has_prev: z.boolean(),
  limit: z.number(),
});

export const adminSessionMessagesSchema = z.object({
  total: z.number(),
  pagination: cursorPaginationSchema,
  data: z.array(adminSessionMessageItemSchema),
});

/* Learner */

export const learnerProfileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  role: z.enum(['admin', 'learner']),
});

/* Learner session dashboard */
export const learnerSessionSchema = z.object({
  total: z.number(),
  total_hours: z.number(),
});

export const learnerProgressSchema = z.object({
  communication: z.number(),
  negotiation: z.number(),
  risk_management: z.number(),
});

export const learnerStatsSchema = z.object({
  session: learnerSessionSchema,
  progress: learnerProgressSchema,
});

export const learnerActivityMetaDataSchema = z.object({
  role: z.string(),
  scenario_title: z.string()
});

export const learnerActivitySchema = z.object({
  user_name: z.string(),
  created_at: z.string(),
  type: z.string(),
  meta_data: learnerActivityMetaDataSchema,
});

export const learnerChatSchema = z.object({
  content: z.string(),
  session_id: z.uuid()
})


/* 
{
      "user_name": "Alex Johnson",
      "created_at": 1773835817, # timestamp
      # possible options: new_user, session_complete, report_generation
      "type": "registration",
      "metadata": {
        # new_user
        "role": "learner",
        # session_complete
        "scenario_title": "Healthcare Data Breach",
      }
    }
*/

// const threatActorSchema = z.object({
//   name: z.string(),
//   description: z.string(),
//   aggression: z.number().min(1).max(10),
// });

export const learnerScenarioSchema = z.object({
  uuid: z.uuid(),
  title: z.string(),
  description: z.string(),
  // difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  time_estimate: z.number(),
  // objectives: z.number(),
  threat_actor: z.string(), // TO BE: Replaced by a threat_actor obj type
});

export const scenariosQuerySchema = z.object({
  per_page: z.number().int().min(1).max(50).optional(),
  cursor: z.string().nullable().optional(),
  type: z.enum(['recommendations', 'all']).optional(),
  industry: z.string().nullable().optional(),
  threat_actor: z.string().nullable().optional(),
});

export const learnerScenariosResponseSchema = z.object({
  total: z.number(),
  pagination: cursorPaginationSchema,
  data: z.array(learnerScenarioSchema),
});


/* DEFINE SESSION SCHEMA */

// PUT /profile response — Assume BE server returns updated profile data
export const updateProfileResponseSchema = learnerProfileSchema;

/* Inferred Types */
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type User = z.infer<typeof userSchema>;

/* admin page*/

export type AdminStats = z.infer<typeof adminStatsSchema>;
export type AdminAnalytics = z.infer<typeof adminAnalyticsSchema>;
export type AdminUserListItem = z.infer<typeof adminUserSchema>;
export type AdminUserById = z.infer<typeof adminUserByIdSchema>;
export type AdminSessionSummary = z.infer<typeof adminSessionSummarySchema>;
export type AdminSessionMessagesQuery = z.infer<typeof adminSessionMessagesQuerySchema>;
export type AdminSessionMessages = z.infer<typeof adminSessionMessagesSchema>;
export type ValidationErrors = z.infer<typeof validationErrorsSchema>;

/* learner page*/

export type LearnerProfile = z.infer<typeof learnerProfileSchema>;
export type LearnerSession = z.infer<typeof learnerSessionSchema>;
export type LearnerProgress = z.infer<typeof learnerProgressSchema>;
export type LearnerStats = z.infer<typeof learnerStatsSchema>;
export type LearnerScenario = z.infer<typeof learnerScenarioSchema>;
export type LearnerActivity = z.infer<typeof learnerActivitySchema>;
export type ScenariosQuery = z.infer<typeof scenariosQuerySchema>;
export type LearnerScenariosResponse = z.infer<typeof learnerScenariosResponseSchema>;
