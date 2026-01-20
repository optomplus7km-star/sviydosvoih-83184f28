import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Briefcase, ArrowRight, Users } from 'lucide-react';

const Cooperation = () => {
  const { t } = useLanguage();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          group:groups(name)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-success/10 text-success hover:bg-success/20">{t('cooperation.status.open')}</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">{t('cooperation.status.in_progress')}</Badge>;
      case 'closed':
        return <Badge variant="secondary">{t('cooperation.status.closed')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="civic-container py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('cooperation.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('cooperation.subtitle')}</p>
        </div>

        {/* Projects List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusBadge(project.status)}
                        {project.group && (
                          <Badge variant="outline" className="font-normal">
                            <Users className="h-3 w-3 mr-1" />
                            {project.group.name}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" asChild className="shrink-0 gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link to={`/projects/${project.id}`}>
                        {t('cooperation.join')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  {project.description && (
                    <CardDescription className="mt-2 line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </CardHeader>
                {project.requirements && (
                  <CardContent>
                    <div className="text-sm">
                      <span className="font-medium text-foreground">{t('cooperation.requirements')}:</span>
                      <span className="text-muted-foreground ml-2 line-clamp-1">{project.requirements}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-xl">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('cooperation.empty')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cooperation;
