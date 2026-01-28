import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User, Newspaper } from 'lucide-react';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';

const CommunicationPage = () => {
  const { t } = useTranslation();

  const { data: news, isLoading } = useQuery({
    queryKey: ['news-published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });
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
            {t('nav', 'communication')}
          </h1>
          <p className="text-lg text-muted-foreground">
            Новини, оновлення та важливі повідомлення спільноти
          </p>
        </div>

        {/* News List */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="kraken-card">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/3 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : news && news.length > 0 ? (
          <div className="space-y-6">
            {news.map((item) => (
              <Card key={item.id} className="kraken-card overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {item.image_url && (
                    <div className="md:w-64 h-48 md:h-auto shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardHeader>
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {item.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(item.published_at), 'd MMMM yyyy', { locale: uk })}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {item.excerpt && (
                        <CardDescription className="text-base line-clamp-3">
                          {item.excerpt}
                        </CardDescription>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="kraken-card border-dashed">
            <CardContent className="py-16 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Newspaper className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Поки немає новин</h3>
              <p className="text-muted-foreground">
                Слідкуйте за оновленнями — скоро тут з'являться новини спільноти
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </KrakenLayout>
  );
};

export default CommunicationPage;
