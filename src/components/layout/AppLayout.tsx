import { Outlet } from 'react-router-dom';
import { ScenarioProvider } from '../../context/ScenarioContext';

export default function AppLayout() {
  return (
    <ScenarioProvider>
      <div className="pt-16 sm:pt-20">
        <Outlet />
      </div>
    </ScenarioProvider>
  );
}
