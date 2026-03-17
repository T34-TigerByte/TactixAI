import type { UserProgress, UserSession } from "../types/auth.types";
import api
 from "./client";

export async function StatsRequest () {
    const response = await api.get<UserSession, UserProgress>('/stats');
    return response;
}