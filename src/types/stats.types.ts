import type { User } from "./auth.types";

export interface StatsContextType {
    user: User | null;
}