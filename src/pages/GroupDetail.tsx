import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Globe, Lock, ChevronRight, Mail, ExternalLink, Home } from 'lucide-react';
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
import { useState } from 'react';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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

  // Fetch parent group for breadcrumbs
  const { data: parentGroup } = useQuery({
    queryKey: ['parent-group', group?.parent_group_id],
    queryFn: async () => {
      if (!group?.parent_group_id) return null;
      const { data, error } = await supabase
        .from('groups')
        .select('id, name, parent_group_id')
        .eq('id', group.parent_group_id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!group?.parent_group_id,
  });

  // Fetch subgroups
  const { data: subgroups } = useQuery({
    queryKey: ['subgroups', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_images(id, image_url, is_thumbnail, display_order)
        `)
        .eq('parent_group_id', id)
        .eq('is_active', true)
        .order('name');
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
  const heroImage = thumbnailImage?.image_url || group.image_url;
  const socialLinks = group.group_social_links?.sort((a: any, b: any) => a.display_order - b.display_order) || [];
  const activeProjects = group.projects?.filter((p: any) => p.status === 'open' || p.status === 'active') || [];
  const isSubgroup = !!group.parent_group_id;

  // Build breadcrumbs
  const breadcrumbs: { id: string; name: string }[] = [];
  if (parentGroup) {
    breadcrumbs.push({ id: parentGroup.id, name: parentGroup.name });
  }
  breadcrumbs.push({ id: group.id, name: group.name });

  return (
    <KrakenLayout>
      {/* Breadcrumbs */}
      <div className="border-b border-border/50 bg-card/50">
        <div className="kraken-container py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/groups" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.id} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium">{crumb.name}</span>
                ) : (
                  <Link 
                    to={`/groups/${crumb.id}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative">
        {heroImage ? (
          <div className="h-64 md:h-80 relative overflow-hidden">
            <img
              src={heroImage}
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
                  {isSubgroup && (
                    <span className="text-xs text-muted-foreground">
                      Подгруппа
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold mb-3">{group.name}</h1>

                {group.description && (
                  <div 
                    className="text-muted-foreground mb-4 prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: group.description.replace(/\n/g, '<br/>') }}
                  />
                )}

                {/* Social links */}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {socialLinks.map((link: any) => (
                      <a
                        key={link.id}
                        href={link.platform === 'email' ? `mailto:${link.url}` : link.url}
                        target={link.platform === 'email' ? undefined : '_blank'}
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
                <div className="flex flex-wrap gap-4">
                  {group.contact_email && (
                    <a
                      href={`mailto:${group.contact_email}`}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-4 w-4" />
                      {group.contact_email}
                    </a>
                  )}
                  {group.website && (
                    <a
                      href={group.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {group.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
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

      {/* Subgroups */}
      {subgroups && subgroups.length > 0 && (
        <section className="py-12">
          <div className="kraken-container">
            <h2 className="text-xl font-bold mb-6">Подгруппы</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subgroups.map((sub: any) => {
                const subImage = sub.group_images?.find((img: any) => img.is_thumbnail)?.image_url 
                  || sub.group_images?.[0]?.image_url 
                  || sub.image_url;
                
                return (
                  <Link
                    key={sub.id}
                    to={`/groups/${sub.id}`}
                    className="kraken-card group overflow-hidden hover:border-primary/50 transition-all"
                  >
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {subImage ? (
                        <img
                          src={subImage}
                          alt={sub.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      {sub.is_private && (
                        <div className="absolute top-2 left-2">
                          <span className="kraken-badge bg-secondary text-secondary-foreground text-xs">
                            <Lock className="h-3 w-3 mr-1" />
                            Приватная
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {sub.name}
                      </h3>
                      {sub.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {sub.description}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Gallery (for subgroups with multiple images) */}
      {sortedImages.length > 1 && (
        <section className="py-12 bg-card/50 border-y border-border/50">
          <div className="kraken-container">
            <h2 className="text-xl font-bold mb-6">{t('project', 'gallery')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedImages.map((image: any) => (
                <button
                  key={image.id}
                  onClick={() => setLightboxImage(image.image_url)}
                  className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 ring-primary transition-all"
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || group.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects in this group */}
      {activeProjects.length > 0 && (
        <section className="py-12">
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

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setLightboxImage(null)}
          >
            <span className="sr-only">Закрыть</span>
            ✕
          </button>
          <img
            src={lightboxImage}
            alt="Увеличенное фото"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </KrakenLayout>
  );
}
