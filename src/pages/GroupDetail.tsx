import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Globe, Lock, ChevronRight, Image as ImageIcon, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { SocialIcon } from '@/components/common/SocialIcon';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: group, isLoading } = useQuery({
    queryKey: ['group-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_images(id, image_url, caption, is_thumbnail, display_order),
          group_social_links(id, platform, url, display_order),
          projects(id, title, status, description)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: membership } = useQuery({
    queryKey: ['group-membership', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('group_members').insert({
        group_id: id,
        user_id: user!.id,
        role: 'member',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-membership', id] });
      toast({ title: 'Вы присоединились к группе!' });
    },
    onError: () => {
      toast({ title: 'Ошибка', description: 'Не удалось присоединиться', variant: 'destructive' });
    },
  });

  if (isLoading) {
    return (
      <KrakenLayout>
        <div className="kraken-container py-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="aspect-video max-w-3xl mb-6" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </KrakenLayout>
    );
  }

  if (!group) {
    return (
      <KrakenLayout>
        <div className="kraken-container py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Группа не найдена</h2>
          <Button variant="outline" onClick={() => navigate('/groups')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад к группам
          </Button>
        </div>
      </KrakenLayout>
    );
  }

  const sortedImages = group.group_images?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const thumbnailImage = sortedImages.find((img: any) => img.is_thumbnail) || sortedImages[0];
  const socialLinks = group.group_social_links?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const activeProjects = group.projects?.filter((p: any) => p.status === 'open' || p.status === 'active') || [];

  return (
    <KrakenLayout>
      {/* Back button */}
      <div className="border-b border-border/50">
        <div className="kraken-container py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/groups')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common', 'back')}
          </Button>
        </div>
      </div>

      {/* Hero */}
      <section className="relative">
        {thumbnailImage ? (
          <div className="h-64 md:h-80 relative overflow-hidden">
            <img
              src={thumbnailImage.image_url}
              alt={group.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-b from-primary/10 to-transparent" />
        )}

        <div className="kraken-container relative -mt-20 z-10">
          <div className="kraken-card p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Group info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    'kraken-badge',
                    group.is_private ? 'bg-secondary' : 'kraken-badge-active'
                  )}>
                    {group.is_private ? (
                      <>
                        <Lock className="h-3 w-3 mr-1" />
                        {t('group', 'private')}
                      </>
                    ) : (
                      <>
                        <Globe className="h-3 w-3 mr-1" />
                        {t('group', 'public')}
                      </>
                    )}
                  </span>
                </div>

                <h1 className="text-3xl font-bold mb-3">{group.name}</h1>

                {group.description && (
                  <p className="text-muted-foreground mb-4">{group.description}</p>
                )}

                {/* Social links */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {socialLinks.map((link: any) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        title={link.platform}
                      >
                        <SocialIcon platform={link.platform} />
                      </a>
                    ))}
                  </div>
                )}

                {/* Contact */}
                {group.contact_email && (
                  <a
                    href={`mailto:${group.contact_email}`}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    {group.contact_email}
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 md:w-48">
                {!group.is_private && user && !membership && (
                  <Button
                    onClick={() => joinMutation.mutate()}
                    disabled={joinMutation.isPending}
                    className="kraken-btn-glow"
                  >
                    {t('group', 'join')}
                  </Button>
                )}
                {membership && (
                  <div className="text-center p-3 rounded-lg bg-success/10 text-success text-sm">
                    Вы участник группы
                  </div>
                )}
                {!user && !group.is_private && (
                  <Button asChild>
                    <Link to="/login">{t('nav', 'login')}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {sortedImages.length > 1 && (
        <section className="py-12">
          <div className="kraken-container">
            <h2 className="text-xl font-bold mb-6">{t('project', 'gallery')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedImages.map((image: any) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 ring-primary transition-all"
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || group.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects in this group */}
      {activeProjects.length > 0 && (
        <section className="py-12 bg-card/50 border-y border-border/50">
          <div className="kraken-container">
            <h2 className="text-xl font-bold mb-6">{t('group', 'projects')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeProjects.map((project: any) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="kraken-card p-4 hover:border-primary/50 transition-colors"
                >
                  <h3 className="font-semibold mb-1">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </KrakenLayout>
  );
}
