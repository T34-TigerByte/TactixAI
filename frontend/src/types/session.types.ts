export interface Session {
    id: string;
    scenarion_name: string;
    date: string;
}

export interface SkillProgress {
    skill_name: string;
    current_score: number;
    session_count: number;
    delta: number;
}