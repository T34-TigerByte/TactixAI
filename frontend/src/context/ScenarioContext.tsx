import { createContext, useEffect, useState } from "react";
import { getScenariosRequest } from "../api/learner.api";
import type { LearnerScenario } from "../schemas/api.schema";

interface ScenarioContextValue {
    scenarios: LearnerScenario[];
}

export const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
    const [scenarios, setScenarios] = useState<LearnerScenario[]>([]);

    useEffect(() => {
        const fetchScenarios = async () => {
            const data = await getScenariosRequest();
            setScenarios(data);
        };
        fetchScenarios();
    }, []);

    return (
        <ScenarioContext.Provider value={{ scenarios }}>
            {children}
        </ScenarioContext.Provider>
    );
}