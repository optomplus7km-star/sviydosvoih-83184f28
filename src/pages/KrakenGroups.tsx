import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Lock, Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function KrakenGroups() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch only root groups (top-level) for the main listing
  const { data: rootGroups, isLoading } = useQuery({
    queryKey: ['root-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_images(image_url, is_thumbnail, display_order)
        `)
        .eq('is_active', true)
        .is('parent_group_id', null)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Count subgroups for each root group
  const { data: subgroupCounts } = useQuery({
    queryKey: ['subgroup-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('parent_group_id')
        .eq('is_active', true)
        .not('parent_group_id', 'is', null);

      if (error) throw error;
      
      // Count subgroups per parent
      const counts: Record<string, number> = {};
      data?.forEach(g => {
        if (g.parent_group_id) {
          counts[g.parent_group_id] = (counts[g.parent_group_id] || 0) + 1;
        }
      });
      return counts;
    },
  });

  const filteredGroups = rootGroups?.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGroupImage = (group: any) => {
    const thumbnail = group.group_images?.find((img: any) => img.is_thumbnail);
    return thumbnail?.image_url || group.group_images?.[0]?.image_url || group.image_url || null;
  };

  return (
    <KrakenLayout>
      {/* Header */}
      <section className="py-12 border-b border-border/50">
        <div className="kraken-container">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('nav', 'groups')}</h1>
          <p className="text-muted-foreground">Сообщества и организации платформы</p>
        </div>
      </section>

      {/* Search */}
      <section className="py-6 bg-card/50 border-b border-border/50 sticky top-16 z-40 backdrop-blur-xl">
        <div className="kraken-container">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common', 'search') + '...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
        </div>
      </section>

      {/* Groups Grid */}
      <section className="py-12">
        <div className="kraken-container">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="kraken-card overflow-hidden">
                  <Skeleton className="aspect-video" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGroups && filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group, i) => {
                const image = getGroupImage(group);
                const subCount = subgroupCounts?.[group.id] || 0;

                return (
                  <Link
                    key={group.id}
                    to={`/groups/${group.id}`}
                    className="kraken-card group overflow-hidden animate-fade-in-up"
                    style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
                  >
                    {/* Image */}
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={group.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Users className="h-12 w-12" />
                        </div>
                      )}

                      {/* Privacy badge */}
                      <div className="absolute top-3 left-3">
                        <span className={cn(
                          'kraken-badge text-xs',
                          group.is_private ? 'bg-secondary text-secondary-foreground' : 'kraken-badge-active'
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
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {group.name}
                      </h3>

                      {group.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {group.description}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {subCount} подгрупп
                        </div>
                        <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Открыть</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('group', 'noGroups')}</h3>
              <p className="text-muted-foreground">
                {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Группы появятся здесь'}
              </p>
            </div>
          )}
        </div>
      </section>
    </KrakenLayout>
  );
}
