export const ROUTES = {
  LOGIN: '/login',
  REGISTER_REQUEST: '/register-request',
  SET_PASSWORD: '/set-password',
  UNAUTHORIZED: '/unauthorized',
  LEARNER: {
    DASHBOARD: '/learner/dashboard',
    SCENARIOS: '/learner/scenarios',
    CHAT: '/learner/chat/:sessionId',
    PROGRESS: '/learner/progress',
    SESSION_HISTORY: '/learner/sessions/:sessionId',
    PROFILE: '/learner/profile',
    PERFORMANCE: '/learner/sessions/:sessionId/performance',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    LEARNER_DETAILS: '/admin/users/:userId',
    SESSION_VIEW: '/admin/sessions/:sessionId',
  },
} as const;