
import { Navigate } from 'react-router-dom';
import { useUserProfile } from '@/hooks/useUserProfile';
import CandidateDashboard from './CandidateDashboard';
import EmployerDashboard from './EmployerDashboard';

const DashboardRouter = () => {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const userType = profile?.user_type as string | undefined;

  if (userType === 'admin' || userType === 'superadmin') {
    return <Navigate to="/admin" replace />;
  }

  if (userType === 'employer') {
    return <EmployerDashboard />;
  }

  return <CandidateDashboard />;
};

export default DashboardRouter;
