import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {ROUTES} from '../../router/routes.ts';
import type { Role } from '../../types/auth.types.ts';


interface Props {
    allowedRoles: Role[];
}

export default function RoleGuard({ allowedRoles }: Props) {
    const { user } = useAuth();
    
     return user && allowedRoles.includes(user.role) ? (
       <Outlet />
     ) : (
       <Navigate to={ROUTES.UNAUTHORIZED} replace />
     );
}
