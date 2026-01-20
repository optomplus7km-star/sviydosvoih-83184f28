import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Briefcase, FileText, Clock } from 'lucide-react';

export default function AdminOverview() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [groups, projects, applications, pendingApplications] = await Promise.all([
        supabase.from('groups').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('applications').select('id', { count: 'exact', head: true }),
        supabase.from('applications').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);
      
      return {
        groups: groups.count || 0,
        projects: projects.count || 0,
        applications: applications.count || 0,
        pendingApplications: pendingApplications.count || 0,
      };
    },
  });

  const statCards = [
    { label: 'Группы', value: stats?.groups || 0, icon: Users, color: 'text-primary' },
    { label: 'Проекты', value: stats?.projects || 0, icon: Briefcase, color: 'text-accent' },
    { label: 'Заявки', value: stats?.applications || 0, icon: FileText, color: 'text-success' },
    { label: 'На рассмотрении', value: stats?.pendingApplications || 0, icon: Clock, color: 'text-warning' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">Обзор платформы гражданского сотрудничества</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
