import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Briefcase, Shield, ArrowRight, Network, FileCheck, Eye } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  const { data: groupsCount } = useQuery({
    queryKey: ['groups-count'],
    queryFn: async () => {
      const { count } = await supabase.from('groups').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: projectsCount } = useQuery({
    queryKey: ['projects-count'],
    queryFn: async () => {
      const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const features = [
    {
      icon: Users,
      title: t('features.catalog.title'),
      description: t('features.catalog.desc'),
      link: '/catalog',
    },
    {
      icon: Briefcase,
      title: t('features.projects.title'),
      description: t('features.projects.desc'),
      link: '/cooperation',
    },
    {
      icon: Shield,
      title: t('features.trust.title'),
      description: t('features.trust.desc'),
      link: '/about',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
        <div className="civic-container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Network className="h-4 w-4" />
              Свій до своїх
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Платформа развития, коммуникации и кооперации
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Строим субъектное гражданское общество
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="gap-2">
                <Link to="/cooperation">
                  {t('hero.cta')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">{t('hero.secondary')}</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="civic-container">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {groupsCount || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('stats.groups')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {projectsCount || 0}
              </div>
              <div className="text-sm text-muted-foreground">{t('stats.projects')}</div>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">∞</div>
              <div className="text-sm text-muted-foreground">{t('stats.participants')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-28">
        <div className="civic-container">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link
                key={feature.title}
                to={feature.link}
                className="group civic-card p-8 flex flex-col items-start"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
                <div className="mt-4 text-primary text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Перейти
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="civic-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Принципи платформи</h2>
            <p className="text-muted-foreground text-lg">
              Ми будуємо нову модель громадянської взаємодії на основі довіри та горизонтальних зв'язків
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <FileCheck className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Верифікація</h3>
              <p className="text-muted-foreground text-sm">
                Кожна група проходить перевірку репутації та експертизи
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <Eye className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Прозорість</h3>
              <p className="text-muted-foreground text-sm">
                Відкритий процес прийняття рішень та звітності
              </p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <Network className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">Горизонтальність</h3>
              <p className="text-muted-foreground text-sm">
                Рівні права та можливості для всіх учасників
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="civic-container">
          <div className="bg-primary rounded-2xl p-8 sm:p-12 lg:p-16 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Готові до співпраці?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Приєднуйтесь до платформи та станьте частиною мережі горизонтальної влади
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/signup">{t('nav.signup')}</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"
              >
                <Link to="/contact">{t('nav.contact')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
