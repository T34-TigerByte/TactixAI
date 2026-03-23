import { Role } from "./auth.types";


export interface LearnerSession {
  total: number;
  average_score: number;
  total_hours: number;
}

export interface LearnerProgress {
  communication: number;
  negotication: number;
  risk_management: number;
}

export interface LearnerStats {
    session: LearnerSession
    progress: LearnerProgress
}