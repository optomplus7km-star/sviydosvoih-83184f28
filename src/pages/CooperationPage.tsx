import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, 
  Calendar, 
  Target,
  CheckCircle2,
  Clock,
  ArrowLeftRight
} from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

type ProjectStatus = 'open' | 'in_progress' | 'closed';

const CooperationPage = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects-cooperation'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ projectId, newStatus }: { projectId: string; newStatus: ProjectStatus }) => {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-cooperation'] });
      toast({
        title: 'Статус оновлено',
        description: 'Проект успішно переміщено',
      });
    },
    onError: () => {
      toast({
        title: 'Помилка',
        description: 'Не вдалося оновити статус проекту',
        variant: 'destructive',
      });
    },
  });

  const handleToggleStatus = (projectId: string, currentStatus: string) => {
    const newStatus: ProjectStatus = currentStatus === 'closed' ? 'open' : 'closed';
    toggleStatusMutation.mutate({ projectId, newStatus });
  };

  const activeProjects = projects?.filter(p => p.status !== 'closed') || [];
  const completedProjects = projects?.filter(p => p.status === 'closed') || [];

  const renderProjectCard = (project: typeof projects extends (infer T)[] | null | undefined ? T : never) => {
    const imageUrl = (project as any).images?.[0];
    
    return (
      <Card key={project.id} className="kraken-card group overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Project Image */}
          {imageUrl && (
            <div className="sm:w-48 h-40 sm:h-auto shrink-0">
              <img
                src={imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {project.status === 'closed' ? (
                      <Badge className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Виконано
                      </Badge>
                    ) : (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Активний
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(project.id, project.status)}
                      disabled={toggleStatusMutation.isPending}
                      className="gap-2"
                    >
                      <ArrowLeftRight className="h-4 w-4" />
                      {project.status === 'closed' ? 'В активні' : 'У виконані'}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild 
                    className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Link to={`/projects/${project.id}`}>
                      Детальніше
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              {project.description && (
                <CardDescription className="mt-2 line-clamp-2">
                  {project.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {project.deadline && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>До {format(new Date(project.deadline), 'd MMM yyyy', { locale: uk })}</span>
                  </div>
                )}
                {project.target_participants && (
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>
                      {project.current_participants || 0}/{project.target_participants} учасників
                    </span>
                  </div>
                )}
              </div>
              {project.requirements && (
                <div className="mt-3 text-sm">
                  <span className="font-medium text-foreground">Вимоги:</span>
                  <span className="text-muted-foreground ml-2 line-clamp-1">{project.requirements}</span>
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <KrakenLayout>
      <div className="kraken-container py-12">
        {/* Header */}
        <div className="max-w-2xl mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 kraken-gradient-text">
            {t('nav', 'cooperation')}
          </h1>
          <p className="text-lg text-muted-foreground">
            Проекти для спільної роботи та кооперації
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'completed')}>
          <TabsList className="mb-6">
            <TabsTrigger value="active" className="gap-2">
              <Clock className="h-4 w-4" />
              Активні проекти
              {activeProjects.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeProjects.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Виконані
              {completedProjects.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {completedProjects.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="kraken-card">
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
          ) : (
            <>
              <TabsContent value="active" className="space-y-4">
                {activeProjects.length > 0 ? (
                  activeProjects.map(renderProjectCard)
                ) : (
                  <Card className="kraken-card border-dashed">
                    <CardContent className="py-16 text-center">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Наразі немає активних проектів</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedProjects.length > 0 ? (
                  completedProjects.map(renderProjectCard)
                ) : (
                  <Card className="kraken-card border-dashed">
                    <CardContent className="py-16 text-center">
                      <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Поки немає виконаних проектів</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </KrakenLayout>
  );
};

export default CooperationPage;
