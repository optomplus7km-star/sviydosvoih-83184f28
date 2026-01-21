import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Eye, Shield, Target, Users, AlertTriangle } from 'lucide-react';

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
        <div className="max-w-4xl space-y-8 mb-16">
          {/* Mission */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">Місія</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Выявление здоровых сил, увеличение их веса в обществе, улучшение коммуникации 
                и кооперации между ними для формирования горизонтальной структуры власти.
              </p>
            </CardContent>
          </Card>

          {/* Motivation */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">Мотивація</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Построение безопасной, комфортной страны со здоровыми вертикальной 
                и горизонтальной структурами власти. Объединение элит без государственных 
                позиций для создания устойчивого гражданского общества.
              </p>
            </CardContent>
          </Card>

          {/* Participants */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">Участники</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Лидеры общественного мнения (ЛОМы), экспертные группы и коллективы, 
                которые приносят добавленную стоимость и берут на себя ответственность 
                (SMART-цели).
              </p>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-warning/10 border border-warning/20">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Важно:</strong> В период военного положения 
                  военные и волонтёры исключены из участия. Проект «Равный к равному» 
                  стартует после завершения активных боевых действий.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="max-w-4xl">
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

        {/* How it works */}
        <div className="max-w-4xl mt-16">
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-8">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-lg font-semibold mb-4">Как это работает?</h3>
                <ol className="space-y-3 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Регистрация группы:</strong> Экспертные группы и организации
                    регистрируются на платформе, проходя верификацию.
                  </li>
                  <li>
                    <strong className="text-foreground">Публикация проектов:</strong> Группы создают проекты с
                    конкретными целями и требованиями к участникам.
                  </li>
                  <li>
                    <strong className="text-foreground">Сотрудничество:</strong> Участники подают заявки на участие,
                    формируются команды для реализации инициатив.
                  </li>
                  <li>
                    <strong className="text-foreground">Прозрачность:</strong> Все процессы и результаты открыты для
                    сообщества.
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
