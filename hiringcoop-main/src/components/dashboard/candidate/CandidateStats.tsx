
import { useEffect, useState } from 'react';
import { FiFileText, FiSearch, FiUsers, FiCheckCircle } from 'react-icons/fi';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface CandidateStatsProps {
  userId: string;
}

const CandidateStats = ({ userId }: CandidateStatsProps) => {
  const [stats, setStats] = useState({ total: 0, inReview: 0, interview: 0, offered: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await (supabase as any)
        .from('applications')
        .select('status')
        .eq('candidate_id', userId);

      if (data) {
        setStats({
          total: data.length,
          inReview: data.filter((a: any) => a.status === 'new' || a.status === 'reviewing').length,
          interview: data.filter((a: any) => a.status === 'interview' || a.status === 'shortlisted').length,
          offered: data.filter((a: any) => a.status === 'offered' || a.status === 'accepted').length,
        });
      }
      setLoading(false);
    };
    if (userId) fetch();
  }, [userId]);

  const items = [
    { label: 'Total Applications', value: stats.total, sub: null, icon: FiFileText, bg: 'bg-primary/10 text-primary' },
    { label: 'In Review', value: stats.inReview, sub: null, icon: FiSearch, bg: 'bg-amber-100 text-amber-600' },
    { label: 'Interviews', value: stats.interview, sub: null, icon: FiUsers, bg: 'bg-blue-100 text-blue-600' },
    { label: 'Offers', value: stats.offered, sub: null, icon: FiCheckCircle, bg: 'bg-green-100 text-green-600' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <h4 className="text-2xl font-bold mt-1">{item.value}</h4>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg}`}>
                <item.icon size={20} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CandidateStats;
