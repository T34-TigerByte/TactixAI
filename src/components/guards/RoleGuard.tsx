import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {ROUTES} from '../../router/routes.ts';
import type { Roles } from '../../types/auth.types.ts';


interface Props {
    allowedRoles: Roles[];
}

export default function RoleGuard({ allowedRoles }: Props) {
    const { user } = useAuth();
    
     return user && allowedRoles.includes(user.role) ? (
       <Outlet />
     ) : (
       <Navigate to={ROUTES.UNAUTHORIZED} replace />
     );
}
