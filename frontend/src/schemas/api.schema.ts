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
  active_users: z.number(),
  user_growth_percentage: z.number(),
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

/* learner page*/

export type LearnerProfile = z.infer<typeof learnerProfileSchema>;
export type LearnerSession = z.infer<typeof learnerSessionSchema>;
export type LearnerProgress = z.infer<typeof learnerProgressSchema>;
export type LearnerStats = z.infer<typeof learnerStatsSchema>;
export type LearnerScenario = z.infer<typeof learnerScenarioSchema>;
export type LearnerActivity = z.infer<typeof learnerActivitySchema>;