import { createContext, useState } from "react"
import type { ReactNode } from "react";
import type { StatsContextType } from "../types/stats.types"
import type { User } from "../types/auth.types";

export const StatsContext = createContext<StatsContextType | null>(null);

export function AuthProvider ({children}: {children : ReactNode}) {
    const [users, setUsers] = useState<User[] | []>([]);
}