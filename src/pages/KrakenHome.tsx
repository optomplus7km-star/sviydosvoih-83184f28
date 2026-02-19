import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { KrakenLayout } from '@/components/layout/KrakenLayout';
import { HeartbeatHero } from '@/components/home/HeartbeatHero';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ActivePolls } from '@/components/home/ActivePolls';
import { LatestNews } from '@/components/home/LatestNews';

export default function KrakenHome() {
  const { t } = useTranslation();
  return (
    <KrakenLayout>
      <HeartbeatHero />

      <ActivePolls />
      <FeaturedProjects />
      <LatestNews />

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="kraken-container relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Готові до співпраці?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Приєднуйтесь до платформи та станьте частиною мережі горизонтальної влади
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