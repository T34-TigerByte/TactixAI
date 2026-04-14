export const ROUTES = {
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  LEARNER: {
    DASHBOARD: '/learner/dashboard',
    SCENARIOS: '/learner/scenarios',
    CHAT: '/learner/chat/:sessionId',
    PROFILE: '/learner/profile',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    LEARNER_DETAILS: '/admin/users/:userId'
  },
} as const;