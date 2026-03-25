export type { LearnerProfile, LearnerStats, LearnerSession, LearnerProgress } from '../schemas/api.schema';

// Legacy alias — components that import Learner can continue to work
export type { LearnerProfile as Learner } from '../schemas/api.schema';

export type { UpdateProfilePayload } from '../schemas/profile.schema';