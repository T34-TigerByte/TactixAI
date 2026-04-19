import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ROUTES } from './routes';
import LearnerDashboard from '../pages/learner/LearnerDashboard';
import ScenarioListPage from '../pages/learner/ScenarioListPage';
import type { LearnerScenario } from '../schemas/api.schema';
import ChatRoomPage from '../pages/learner/ChatRoomPage';
import ProfileSettingPage from '../pages/learner/ProfileSettingPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import LearnerDetailsPage from '../pages/admin/LearnerDetailsPage';
import LoginPage from '../pages/auth/LoginPage';

import { useAuth } from '../hooks/useAuth';
import { useScenario } from '../hooks/useScenario';

// Guard Routes for RBAC
import ProtectedRoute from '../components/guards/ProtectedRoute';
import RoleGuard from '../components/guards/RoleGuard';
import AppLayout from '../components/layout/AppLayout';

// Wrapper to inject the start-scenario handler via useNavigate
function ScenarioListPageRoute() {
    const navigate = useNavigate();
    const { setSelectedScenario } = useScenario();
    const handleStartScenario = (scenario: LearnerScenario) => {
        setSelectedScenario(scenario);
        navigate(`/learner/chat/${scenario.uuid}`);
    };
    return <ScenarioListPage onStartScenario={handleStartScenario} />;
}

export default function AppRouter() {
    const { isLoading } = useAuth(); // Custom hook to check auth status

    if (isLoading) {
        return <div>Loading...</div>; // Show loading state while checking auth
    }

    return (
        <Routes>
            {/* Public Routes */}

            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.UNAUTHORIZED} element={<div>Unauthorized Access</div>} />

            {/* Protected Routes */}

            {/* Learner Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route element={<RoleGuard allowedRoles={['learner']} />}>
                        <Route path={ROUTES.LEARNER.DASHBOARD} element={<LearnerDashboard />} />
                        <Route path={ROUTES.LEARNER.SCENARIOS} element={<ScenarioListPageRoute />} />
                        <Route path={ROUTES.LEARNER.CHAT} element={<ChatRoomPage />} />
                        <Route path={ROUTES.LEARNER.PROFILE} element={<ProfileSettingPage />} />
                        {/* Add more learner routes here */}
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<RoleGuard allowedRoles={['admin']} />}>
                        <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
                        <Route path={ROUTES.ADMIN.LEARNER_DETAILS} element={<LearnerDetailsPage />} />
                        {/* Add more admin routes here */}
                    </Route>
                </Route>
            </Route>
                

            {/* Redirect any unknown routes to login */}
            <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
        </Routes>
    );
}