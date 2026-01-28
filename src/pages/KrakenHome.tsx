import { Link } from 'react-router-dom';
import { ArrowRight, Anchor, Users, Compass, BarChart3, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ActivePolls } from '@/components/home/ActivePolls';
import { LatestNews } from '@/components/home/LatestNews';

export default function KrakenHome() {
  const { t } = useTranslation();

  return (
    <KrakenLayout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center kraken-waves">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="kraken-container relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-primary mb-6 animate-fade-in">
              <Waves className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wider uppercase">Kraken Morskoi</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
              {t('hero', 'title').split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 1 ? 'kraken-gradient-text' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {t('hero', 'subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Button size="lg" className="kraken-btn-glow gap-2" asChild>
                <Link to="/catalog">
                  <Compass className="h-5 w-5" />
                  {t('hero', 'cta')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link to="/signup">
                  {t('hero', 'ctaSecondary')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path 
              d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" 
              fill="hsl(var(--card))"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-12 border-b border-border/50">
        <div className="kraken-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Anchor, value: '50+', label: 'Проектов' },
              { icon: Users, value: '200+', label: 'Участников' },
              { icon: Compass, value: '15', label: 'Групп' },
              { icon: BarChart3, value: '95%', label: 'Успешных' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Polls (for authenticated users) */}
      <ActivePolls />

      {/* Featured Projects */}
      <FeaturedProjects />

      {/* Latest News */}
      <LatestNews />

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="kraken-container relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Готовы к погружению?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Присоединяйтесь к сообществу и начните свой путь в мире морских проектов
          </p>
          <Button size="lg" className="kraken-btn-glow" asChild>
            <Link to="/signup">
              {t('common', 'joinNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </KrakenLayout>
  );
}
