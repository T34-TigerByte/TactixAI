export interface Learner {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export interface LearnerSession {
  total: number;
  average_score: number;
  total_hours: number;
  current_streak?: number;
}

export interface LearnerProgress {
  communication: number;
  negotication: number;
  risk_management: number;
}

export interface LearnerStats {
  session: LearnerSession;
  progress: LearnerProgress;
}

export interface LearnerProfile {
  first_name: string;
  last_name: string;
  email: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  current_password?: string;
  new_password?: string;
  new_password_confirmation?: string;
}