import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './router/AppRouter';
import SkipNav from './components/ui/SkipNav';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) =>
      console.error(`[QueryCache] ${String(query.queryKey)}:`, error),
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SkipNav />
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
