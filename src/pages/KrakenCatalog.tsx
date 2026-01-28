import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Image as ImageIcon, Clock, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

export default function KrakenCatalog() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'active' | 'completed'>('all');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['catalog-projects', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select(`
          *,
          groups(id, name),
          project_images(image_url, is_thumbnail)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredProjects = projects?.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProjectImage = (project: any) => {
    const thumbnail = project.project_images?.find((img: any) => img.is_thumbnail);
    return thumbnail?.image_url || project.project_images?.[0]?.image_url || null;
  };

  const getDaysLeft = (deadline: string | null) => {
    if (!deadline) return null;
    const days = differenceInDays(new Date(deadline), new Date());
    return days > 0 ? days : 0;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return 'kraken-badge-active';
      case 'active':
        return 'kraken-badge-pending';
      case 'completed':
        return 'kraken-badge-closed';
      default:
        return 'kraken-badge-draft';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return t('project', 'statusOpen');
      case 'active':
        return t('project', 'statusActive');
      case 'completed':
        return t('project', 'statusCompleted');
      default:
        return t('project', 'statusDraft');
    }
  };

  return (
    <KrakenLayout>
      {/* Header */}
      <section className="py-12 border-b border-border/50">
        <div className="kraken-container">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('nav', 'catalog')}</h1>
          <p className="text-muted-foreground">Все активные проекты платформы</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-card/50 border-b border-border/50 sticky top-16 z-40 backdrop-blur-xl">
        <div className="kraken-container">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('common', 'search') + '...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>

            {/* Status filter */}
            <div className="flex gap-2">
              {(['all', 'open', 'active', 'completed'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    statusFilter === status && 'kraken-btn-glow'
                  )}
                >
                  {status === 'all' ? t('dashboard', 'filterAll') : getStatusLabel(status)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="kraken-container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="kraken-card">
                  <Skeleton className="aspect-video" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProjects && filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, i) => {
                const image = getProjectImage(project);
                const daysLeft = getDaysLeft(project.deadline);

                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="kraken-card group overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
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
                          <ImageIcon className="h-12 w-12" />
                        </div>
                      )}

                      {/* Status badge */}
                      <div className="absolute top-3 left-3">
                        <span className={cn('kraken-badge', getStatusBadge(project.status))}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>

                      {project.groups && (
                        <p className="text-sm text-primary/80 mb-2 flex items-center gap-1">
                          <ChevronRight className="h-3 w-3" />
                          {project.groups.name}
                        </p>
                      )}

                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {project.description}
                        </p>
                      )}

                      {/* Meta */}
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

                      {/* Progress bar */}
                      {project.target_participants && project.target_participants > 0 && (
                        <div className="mt-3 kraken-progress">
                          <div
                            className="kraken-progress-bar"
                            style={{
                              width: `${Math.min(
                                ((project.current_participants || 0) / project.target_participants) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('project', 'noProjects')}</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? 'Попробуйте изменить параметры поиска'
                  : 'Станьте первым, кто создаст проект'}
              </p>
              <Button className="kraken-btn-glow" asChild>
                <Link to="/signup">{t('project', 'createFirst')}</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </KrakenLayout>
  );
}
