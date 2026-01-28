import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Users, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { differenceInDays } from 'date-fns';

export function FeaturedProjects() {
  const { t } = useTranslation();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['featured-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          groups(name),
          project_images(image_url, is_thumbnail)
        `)
        .eq('is_active', true)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  const getProjectImage = (project: any) => {
    const thumbnail = project.project_images?.find((img: any) => img.is_thumbnail);
    return thumbnail?.image_url || project.project_images?.[0]?.image_url || null;
  };

  const getDaysLeft = (deadline: string | null) => {
    if (!deadline) return null;
    const days = differenceInDays(new Date(deadline), new Date());
    return days > 0 ? days : 0;
  };

  return (
    <section className="py-16 bg-background">
      <div className="kraken-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">{t('sections', 'featuredProjects')}</h2>
            <p className="text-muted-foreground mt-1">Актуальные проекты, ищущие участников</p>
          </div>
          <Button variant="ghost" className="gap-2" asChild>
            <Link to="/catalog">
              {t('common', 'viewAll')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="kraken-card p-4">
                <Skeleton className="aspect-video rounded-lg mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, i) => {
              const image = getProjectImage(project);
              const daysLeft = getDaysLeft(project.deadline);

              return (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="kraken-card group overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Image */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    
                    {/* Status badge */}
                    <div className="absolute top-3 left-3">
                      <span className="kraken-badge kraken-badge-active">
                        {t('project', 'statusOpen')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    {project.groups && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {project.groups.name}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {daysLeft !== null && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {daysLeft} {t('project', 'daysLeft')}
                        </div>
                      )}
                      {project.target_participants && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {project.current_participants || 0}/{project.target_participants}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>{t('project', 'noProjects')}</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link to="/signup">{t('project', 'createFirst')}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
