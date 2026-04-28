import api from './client';
import { parseResponse } from '../utils/parse.utils';
import {
  learnerStatsSchema,
  learnerProfileSchema,
  updateProfileResponseSchema,
  sessionStartSchema,
  sessionDetailsSchema,
  sessionSummarySchema,
  scenarioPageSchema,
  sessionListPageSchema,
  chatMessagesPageSchema,
  type LearnerStats,
  type LearnerProfile,
  type SessionStart,
  type SessionDetails,
  type SessionSummary,
  type ScenarioPage,
  type SessionListPage,
  type ChatMessagesPage,
} from '../schemas/api.schema';
import type { UpdateProfilePayload } from '../schemas/profile.schema';

export async function getLearnerStatsRequest(): Promise<LearnerStats> {
  const response = await api.get('/stats');
  return parseResponse(learnerStatsSchema, response.data, 'getLearnerStatsRequest');
}

export async function getLearnerProfileRequest(): Promise<LearnerProfile> {
  const response = await api.get('/me');
  return parseResponse(learnerProfileSchema, response.data, 'getLearnerProfileRequest');
}

export async function updateLearnerProfileRequest(payload: UpdateProfilePayload): Promise<LearnerProfile> {
  const response = await api.put('/profile', payload);
  return parseResponse(updateProfileResponseSchema, response.data, 'updateLearnerProfileRequest');
}

export async function getScenariosRequest(cursor?: string): Promise<ScenarioPage> {
  const response = await api.get('/scenarios', { params: cursor ? { cursor } : undefined });
  return parseResponse(scenarioPageSchema, response.data, 'getScenariosRequest');
}

export async function startSessionRequest(scenarioUuid: string): Promise<SessionStart> {
  const response = await api.post('/sessions/start', { scenario_uuid: scenarioUuid });
  return parseResponse(sessionStartSchema, response.data, 'startSessionRequest');
}

export async function endSessionRequest(scenarioUuid: string | undefined) {
  await api.post(`/sessions/${scenarioUuid}/end`);
}

export async function getSessionRequest(sessionUuid: string): Promise<SessionDetails> {
  const response = await api.get(`/sessions/${sessionUuid}`);
  return parseResponse(sessionDetailsSchema, response.data, 'getSessionRequest');
}

export async function getSessionSummaryRequest(sessionUuid: string): Promise<SessionSummary> {
  const response = await api.get(`/sessions/${sessionUuid}/summary`);
  return parseResponse(sessionSummarySchema, response.data, 'getSessionSummaryRequest');
}

export async function getSessionsRequest(cursor?: string): Promise<SessionListPage> {
  const params = cursor ? { cursor } : {};
  const response = await api.get('/sessions', { params });
  return parseResponse(sessionListPageSchema, response.data, 'getSessionsRequest');
}

export async function getSessionMessagesRequest(sessionUuid: string, cursor?: string): Promise<ChatMessagesPage> {
  const params = cursor ? { cursor } : {};
  const response = await api.get(`/sessions/${sessionUuid}/messages`, { params });
  return parseResponse(chatMessagesPageSchema, response.data, 'getSessionMessagesRequest');
}
