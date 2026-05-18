import DashboardLayout from '@/components/dashboard/DashboardLayout';
import JobDetailPage from './JobDetailPage';

const DashboardJobDetailPage = () => {
  return (
    <DashboardLayout userType="candidate">
      <div className="p-6">
        <JobDetailPage embedded />
      </div>
    </DashboardLayout>
  );
};

export default DashboardJobDetailPage;
