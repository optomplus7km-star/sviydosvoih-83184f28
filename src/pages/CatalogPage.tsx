import { Link } from 'react-router-dom';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CatalogPage = () => {
  const { t } = useTranslation();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('is_active', true)
        .is('parent_group_id', null) // Only root groups
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  return (
    <KrakenLayout>
      <div className="kraken-container py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 kraken-gradient-text">
            {t('nav', 'catalog')}
          </h1>
          <p className="text-lg text-muted-foreground">
            Каталог організацій та спільнот платформи
          </p>
        </div>

        {/* Groups Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="kraken-card">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-14 h-14 rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : groups && groups.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Link key={group.id} to={`/groups/${group.id}`}>
                <Card className="h-full kraken-card group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {group.image_url ? (
                        <img
                          src={group.image_url}
                          alt={group.name}
                          className="w-14 h-14 rounded-lg object-cover bg-muted"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Users className="h-7 w-7 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                          {group.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {group.description && (
                      <CardDescription className="line-clamp-3">
                        {group.description}
                      </CardDescription>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4" />
                      <span>Детальніше</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-xl">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Групи ще не додані</p>
          </div>
        )}
      </div>
    </KrakenLayout>
  );
};

export default CatalogPage;
