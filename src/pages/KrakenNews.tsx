import { Link } from 'react-router-dom';
import { Calendar, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ru, uk, enUS } from 'date-fns/locale';

export default function KrakenNews() {
  const { t, language } = useTranslation();
  const dateLocale = language === 'ru' ? ru : language === 'ua' ? uk : enUS;

  const { data: news, isLoading } = useQuery({
    queryKey: ['news-list'],
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
      {/* Header */}
      <section className="py-12 border-b border-border/50">
        <div className="kraken-container">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('nav', 'news')}</h1>
          <p className="text-muted-foreground">Новости и обновления платформы</p>
        </div>
      </section>

      {/* News List */}
      <section className="py-12">
        <div className="kraken-container">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="kraken-card">
                  <Skeleton className="aspect-video" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : news && news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((article, i) => (
                <Link
                  key={article.id}
                  to={`/news/${article.slug}`}
                  className="kraken-card group overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(i, 8) * 0.05}s` }}
                >
                  {/* Image */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-12 w-12" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.published_at &&
                        format(new Date(article.published_at), 'd MMMM yyyy', { locale: dateLocale })}
                    </div>

                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('news', 'noNews')}</h3>
              <p className="text-muted-foreground">Новости появятся здесь</p>
            </div>
          )}
        </div>
      </section>
    </KrakenLayout>
  );
}
