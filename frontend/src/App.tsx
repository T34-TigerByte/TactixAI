import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import SkipNav from './components/ui/SkipNav';
import { ScenarioProvider } from './context/ScenarioContext';

export default function App() {
  return (
    <BrowserRouter>
      <SkipNav />
      <AuthProvider>
        <ScenarioProvider>
          <AppRouter />
        </ScenarioProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
