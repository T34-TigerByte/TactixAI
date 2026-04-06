import { createContext, useEffect, useState } from "react";
import { getScenariosRequest } from "../api/learner.api";
import type { LearnerScenario } from "../schemas/api.schema";

interface ScenarioContextValue {
    scenarios: LearnerScenario[];
    selectedScenario: LearnerScenario | null;
    setSelectedScenario: (scenario: LearnerScenario) => void;
}

export const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
    const [scenarios, setScenarios] = useState<LearnerScenario[]>([]);
    const [selectedScenario, setSelectedScenario] = useState<LearnerScenario | null>(null);

    useEffect(() => {
        const fetchScenarios = async () => {
            const data = await getScenariosRequest();
            setScenarios(data);
        };
        fetchScenarios();
    }, [scenarios.length]);

    return (
        <ScenarioContext.Provider value={{ scenarios, selectedScenario, setSelectedScenario }}>
            {children}
        </ScenarioContext.Provider>
    );
}