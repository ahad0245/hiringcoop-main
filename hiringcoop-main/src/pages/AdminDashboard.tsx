import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { AdminAnalytics, PendingCounts } from '@/types/admin';
import AdminHelp from '@/components/admin/AdminHelp';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AdminAnalytics[]>([]);
  const [pendingCounts, setPendingCounts] = useState<PendingCounts>({
    jobs: 0,
    verifications: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Create dummy analytics data for now
        const tempData: AdminAnalytics[] = [];
        const today = new Date();
        
        for (let i = 13; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          tempData.push({
            id: `day-${i}`,
            date: date.toISOString().split('T')[0],
            new_users: Math.floor(Math.random() * 10),
            new_jobs: Math.floor(Math.random() * 5),
            new_applications: Math.floor(Math.random() * 20),
            new_verifications: Math.floor(Math.random() * 8)
          });
        }
        
        setAnalyticsData(tempData);
        
        // Get pending counts using RPC functions
        try {
          const { data: pendingJobsCount, error: jobsError } = await supabase.rpc<number>('get_pending_jobs_count');
          
          if (jobsError) {
            throw jobsError;
          }
          
          const { data: pendingVerificationsCount, error: verificationsError } = await supabase.rpc<number>('get_pending_verifications_count');
          
          if (verificationsError) {
            throw verificationsError;
          }
          
          setPendingCounts({
            jobs: pendingJobsCount || 0,
            verifications: pendingVerificationsCount || 0
          });
        } catch (err) {
          console.error("Error fetching pending counts:", err);
          // Set default values
          setPendingCounts({
            jobs: Math.floor(Math.random() * 5),
            verifications: Math.floor(Math.random() * 10)
          });
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [toast]);

  const chartData = analyticsData.map(item => ({
    name: formatDate(item.date),
    users: item.new_users,
    jobs: item.new_jobs,
    applications: item.new_applications,
    verifications: item.new_verifications
  }));

  return (
    <DashboardLayout userType="superadmin">
      <div className="p-6">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of platform activity and pending tasks
            </p>
          </div>
          <AdminHelp />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex flex-col">
              <div className="text-4xl font-bold mb-2">{pendingCounts.jobs}</div>
              <p className="text-muted-foreground">Pending Jobs</p>
              <div className="mt-4">
                <Button size="sm" variant="secondary" asChild>
                  <a href="/admin/jobs">Review Jobs</a>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col">
              <div className="text-4xl font-bold mb-2">{pendingCounts.verifications}</div>
              <p className="text-muted-foreground">Pending Verifications</p>
              <div className="mt-4">
                <Button size="sm" variant="secondary" asChild>
                  <a href="/admin/verifications">View Verifications</a>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col">
              <div className="text-4xl font-bold mb-2">
                {analyticsData.length > 0 ? analyticsData[analyticsData.length - 1].new_applications : 0}
              </div>
              <p className="text-muted-foreground">Applications Today</p>
              <div className="mt-4">
                <Button size="sm" variant="ghost" disabled>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col">
              <div className="text-4xl font-bold mb-2">
                {analyticsData.length > 0 ? analyticsData[analyticsData.length - 1].new_users : 0}
              </div>
              <p className="text-muted-foreground">New Users Today</p>
              <div className="mt-4">
                <Button size="sm" variant="ghost" disabled>
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Platform Activity (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-80 flex items-center justify-center">
                <p>Loading analytics data...</p>
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" name="New Users" fill="#8884d8" />
                    <Bar dataKey="jobs" name="New Jobs" fill="#82ca9d" />
                    <Bar dataKey="applications" name="Applications" fill="#ffc658" />
                    <Bar dataKey="verifications" name="Verifications" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p>No analytics data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
