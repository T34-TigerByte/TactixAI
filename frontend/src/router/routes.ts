export const ROUTES = {
  LOGIN: '/login',
  UNAUTHORIZED: '/unauthorized',
  LEARNER: {
    DASHBOARD: '/learner/dashboard',
    CHAT: '/learner/chat/:sessionId',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    LEARNER_DETAILS: '/admin/users/:userId'
  },
} as const;