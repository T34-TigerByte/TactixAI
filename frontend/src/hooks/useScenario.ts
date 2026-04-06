import { use }  from 'react';
import { ScenarioContext } from '../context/ScenarioContext';

export function useScenario() {
    const context = use(ScenarioContext);
    if (!context) {
        throw new Error('useScenario must be used within a ScenarioProvider');
    }
    return context;
}