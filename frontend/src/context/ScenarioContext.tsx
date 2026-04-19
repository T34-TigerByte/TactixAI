import { createContext, useEffect, useState } from "react";
import { getScenariosRequest } from "../api/learner.api";
import type { LearnerScenario } from "../schemas/api.schema";

interface ScenarioContextValue {
    scenarios: LearnerScenario[];
    hasNext: boolean;
    loadMore: () => Promise<void>;
    selectedScenario: LearnerScenario | null;
    setSelectedScenario: (scenario: LearnerScenario) => void;
}

export const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
    const [scenarios, setScenarios] = useState<LearnerScenario[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [hasNext, setHasNext] = useState(false);
    const [selectedScenario, setSelectedScenario] = useState<LearnerScenario | null>(null);

    useEffect(() => {
        const fetchScenarios = async () => {
            const page = await getScenariosRequest();
            setScenarios(page.data);
            setNextCursor(page.pagination.next_cursor);
            setHasNext(page.pagination.has_next);
        };
        fetchScenarios();
    }, []);

    const loadMore = async () => {
        if (!nextCursor) return;
        const page = await getScenariosRequest(nextCursor);
        setScenarios((prev) => [...prev, ...page.data]);
        setNextCursor(page.pagination.next_cursor);
        setHasNext(page.pagination.has_next);
    };

    return (
        <ScenarioContext.Provider value={{ scenarios, hasNext, loadMore, selectedScenario, setSelectedScenario }}>
            {children}
        </ScenarioContext.Provider>
    );
}
