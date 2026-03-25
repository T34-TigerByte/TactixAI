import type { LearnerStats, Learner } from '../types/learner.types';
import type { UpdateProfilePayload } from '../types/learner.types';
import api from './client';
import { parseResponse } from '../utils/parse.utils';
import { learnerStatsSchema, learnerProfileSchema, updateProfileResponseSchema } from '../schemas/api.schema';
import type { LearnerProfile } from '../schemas/api.schema';

export async function getLearnerStatsRequest(): Promise<LearnerStats> {
  const response = await api.get('/stats');
  return parseResponse(learnerStatsSchema, response.data, 'getLearnerStatsRequest');
}

export async function getLearnerProfileRequest(): Promise<Learner> {
  const response = await api.get('/me');
  return parseResponse(learnerProfileSchema, response.data, 'getLearnerProfileRequest');
}

export async function updateLearnerProfileRequest(payload: UpdateProfilePayload): Promise<LearnerProfile> {
  const response = await api.put('/profile', payload);
  return parseResponse(updateProfileResponseSchema, response.data, 'updateLearnerProfileRequest');
}
