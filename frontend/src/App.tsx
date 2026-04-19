import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import SkipNav from './components/ui/SkipNav';

export default function App() {
  return (
    <BrowserRouter>
      <SkipNav />
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}
