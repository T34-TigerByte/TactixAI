import { createContext } from 'react';
import type { User } from '../schemas/api.schema';

interface StatsContextType {
  user: User | null;
}

export const StatsContext = createContext<StatsContextType | null>(null);
