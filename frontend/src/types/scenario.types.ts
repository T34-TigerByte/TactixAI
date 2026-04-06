export interface Scenario {
    title: string;
    description: string;
    time_estimate: number; // in minutes
    uuid: string;
    threat_actor: string
}