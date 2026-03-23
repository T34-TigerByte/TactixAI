import type { User } from "./auth.types";

export interface UserSession {
  total: number;
  average_score: number;
  total_hours: number;
}

export interface UserProgress {
  communication: number;
  negotication: number;
  risk_management: number;
}

export interface StatsContextType {
    user: User | null;
}