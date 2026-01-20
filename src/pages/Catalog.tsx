import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, Mail, Users } from 'lucide-react';

const Catalog = () => {
  const { t } = useLanguage();

  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <div className="civic-container py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('catalog.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('catalog.subtitle')}</p>
        </div>

        {/* Groups Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-12 w-12 rounded-lg mb-4" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : groups && groups.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card key={group.id} className="flex flex-col">
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
                      <CardTitle className="text-lg truncate">{group.name}</CardTitle>
                      {group.website && (
                        <CardDescription className="truncate">
                          {group.website.replace(/^https?:\/\//, '')}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  {group.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {group.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-auto">
                    {group.website && (
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a
                          href={group.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Сайт
                        </a>
                      </Button>
                    )}
                    {group.contact_email && (
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <a href={`mailto:${group.contact_email}`} className="gap-2">
                          <Mail className="h-4 w-4" />
                          {t('catalog.contact')}
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted/30 rounded-xl">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('catalog.empty')}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Catalog;
