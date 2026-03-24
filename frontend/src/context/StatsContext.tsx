import { createContext } from "react";
import type { StatsContextType } from "../types/stats.types";

export const StatsContext = createContext<StatsContextType | null>(null);
