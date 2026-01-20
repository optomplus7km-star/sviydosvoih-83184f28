import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Eye, Shield } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Network,
      title: t('about.values.horizontal'),
      description: t('about.values.horizontal.desc'),
    },
    {
      icon: Eye,
      title: t('about.values.transparency'),
      description: t('about.values.transparency.desc'),
    },
    {
      icon: Shield,
      title: t('about.values.responsibility'),
      description: t('about.values.responsibility.desc'),
    },
  ];

  return (
    <Layout>
      <div className="civic-container py-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t('about.title')}</h1>
        </div>

        {/* Manifesto */}
        <div className="max-w-3xl mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('about.manifesto.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">{t('about.manifesto.p1')}</p>
              <p className="text-lg leading-relaxed">{t('about.manifesto.p2')}</p>
              <p className="text-lg leading-relaxed">{t('about.manifesto.p3')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-8">{t('about.values.title')}</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-3xl mt-16">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-4">Як це працює?</h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Реєстрація групи:</strong> Експертні групи та організації
                    реєструються на платформі, проходячи верифікацію.
                  </li>
                  <li>
                    <strong className="text-foreground">Публікація проєктів:</strong> Групи створюють проєкти з
                    конкретними цілями та вимогами до учасників.
                  </li>
                  <li>
                    <strong className="text-foreground">Співпраця:</strong> Учасники подають заявки на участь,
                    формуються команди для реалізації ініціатив.
                  </li>
                  <li>
                    <strong className="text-foreground">Прозорість:</strong> Всі процеси та результати відкриті для
                    спільноти.
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default About;
