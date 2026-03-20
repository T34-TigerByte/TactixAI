export interface Session {
    id: string;
    scenario_name: string;
    date: string;
}

export interface SkillProgress {
    skill_name: string;
    current_score: number;
    session_count: number;
    delta: number;
}