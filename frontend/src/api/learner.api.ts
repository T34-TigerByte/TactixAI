import type { Learner, LearnerStats, UpdateProfilePayload } from "../types/learner.types";
import api from "./client";

export async function getLearnerStatsRequest(): Promise<LearnerStats> {
  const response = await api.get<LearnerStats>('/stats');
  return response.data;
}

export async function getLearnerProfileRequest(): Promise<Learner> {
    const response = await api.get<Learner>('/me');
    return response.data
}

export async function updateLearnerProfileRequest(userId: number, payload: UpdateProfilePayload) {
  const response = await api.put(`/profile/${userId}`, payload);
  return response.data;
}