import { useAuth } from "../../hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from '../../router/routes'

export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />
    }
    
    return <Outlet />
}
