import { createContext, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getScenariosRequest } from "../api/learner.api";
import type { LearnerScenario } from "../schemas/api.schema";

interface ScenarioContextValue {
    scenarios: LearnerScenario[];
    hasNext: boolean;
    loadMore: () => void;
    selectedScenario: LearnerScenario | null;
    setSelectedScenario: (scenario: LearnerScenario) => void;
}

export const ScenarioContext = createContext<ScenarioContextValue | null>(null);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
    const [selectedScenario, setSelectedScenario] = useState<LearnerScenario | null>(null);

    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey: ['scenarios'],
        queryFn: ({ pageParam }: { pageParam: string | undefined }) => getScenariosRequest(pageParam),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.pagination.next_cursor ?? undefined,
    });

    const scenarios = data?.pages.flatMap((p) => p.data) ?? [];

    return (
        <ScenarioContext.Provider value={{
            scenarios,
            hasNext: hasNextPage,
            loadMore: fetchNextPage,
            selectedScenario,
            setSelectedScenario,
        }}>
            {children}
        </ScenarioContext.Provider>
    );
}
