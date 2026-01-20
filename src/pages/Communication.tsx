import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { MessageSquare, Bell, Newspaper } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Communication = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="civic-container py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('communication.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('communication.subtitle')}</p>
        </div>

        {/* Coming Soon Placeholder */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Newspaper className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">{t('communication.coming')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Bell className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Оновлення</h3>
                    <p className="text-sm text-muted-foreground">
                      Новини про розвиток платформи та нові можливості
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Дискусії</h3>
                    <p className="text-sm text-muted-foreground">
                      Обговорення важливих тем серед учасників спільноти
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Communication;
