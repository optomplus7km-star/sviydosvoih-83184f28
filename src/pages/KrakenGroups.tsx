import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Lock, Globe, Image as ImageIcon, ChevronRight, FolderTree } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'all' | 'hierarchy'>('all');

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_images(image_url, is_thumbnail),
          projects(id)
        `)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  const filteredGroups = groups?.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Organize groups hierarchically
  const rootGroups = filteredGroups?.filter((g) => !g.parent_group_id);
  const childGroups = filteredGroups?.filter((g) => g.parent_group_id);

  const getGroupImage = (group: any) => {
    const thumbnail = group.group_images?.find((img: any) => img.is_thumbnail);
    return thumbnail?.image_url || group.group_images?.[0]?.image_url || group.image_url || null;
  };

  const getChildrenCount = (groupId: string) => {
    return childGroups?.filter((g) => g.parent_group_id === groupId).length || 0;
  };

  return (
    <KrakenLayout>
      {/* Header */}
      <section className="py-12 border-b border-border/50">
        <div className="kraken-container">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('nav', 'groups')}</h1>
          <p className="text-muted-foreground">Сообщества и группы платформы</p>
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

            {/* View mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('all')}
                className={cn(viewMode === 'all' && 'kraken-btn-glow')}
              >
                <Users className="h-4 w-4 mr-2" />
                Все группы
              </Button>
              <Button
                variant={viewMode === 'hierarchy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('hierarchy')}
                className={cn(viewMode === 'hierarchy' && 'kraken-btn-glow')}
              >
                <FolderTree className="h-4 w-4 mr-2" />
                Иерархия
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Groups Grid */}
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
          ) : viewMode === 'hierarchy' ? (
            // Hierarchical view
            <div className="space-y-8">
              {rootGroups?.map((group, i) => (
                <div key={group.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <GroupCard group={group} getGroupImage={getGroupImage} t={t} isRoot />
                  
                  {/* Child groups */}
                  {getChildrenCount(group.id) > 0 && (
                    <div className="ml-8 mt-4 pl-4 border-l-2 border-primary/20 space-y-4">
                      {childGroups
                        ?.filter((child) => child.parent_group_id === group.id)
                        .map((child) => (
                          <GroupCard key={child.id} group={child} getGroupImage={getGroupImage} t={t} />
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : filteredGroups && filteredGroups.length > 0 ? (
            // Grid view
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group, i) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  getGroupImage={getGroupImage}
                  t={t}
                  style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
                />
              ))}
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

interface GroupCardProps {
  group: any;
  getGroupImage: (group: any) => string | null;
  t: (section: string, key: string) => string;
  isRoot?: boolean;
  style?: React.CSSProperties;
}

function GroupCard({ group, getGroupImage, t, isRoot, style }: GroupCardProps) {
  const image = getGroupImage(group);
  const projectCount = group.projects?.length || 0;

  return (
    <Link
      to={`/groups/${group.id}`}
      className={cn(
        'kraken-card group overflow-hidden animate-fade-in-up block',
        isRoot && 'border-primary/30'
      )}
      style={style}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-48 aspect-video sm:aspect-square bg-muted relative overflow-hidden flex-shrink-0">
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
              'kraken-badge',
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
        <div className="p-4 flex-1">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {group.name}
          </h3>

          {group.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {group.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              {projectCount} {t('group', 'projects').toLowerCase()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
