import { Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Send, Instagram, Youtube, Twitter, Users } from 'lucide-react';
export function KrakenFooter() {
  const {
    t
  } = useTranslation();
  const footerLinks = {
    platform: [{
      href: '/catalog',
      label: t('nav', 'catalog')
    }, {
      href: '/groups',
      label: t('nav', 'groups')
    }, {
      href: '/news',
      label: t('nav', 'news')
    }],
    about: [{
      href: '/about',
      label: t('nav', 'about')
    }, {
      href: '/contact',
      label: t('common', 'contact')
    }]
  };
  const socialLinks = [{
    icon: Send,
    href: '#',
    label: 'Telegram'
  }, {
    icon: Instagram,
    href: '#',
    label: 'Instagram'
  }, {
    icon: Youtube,
    href: '#',
    label: 'YouTube'
  }, {
    icon: Twitter,
    href: '#',
    label: 'X/Twitter'
  }];
  return <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="kraken-container py-12">
        

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Свій до своїх. {t('footer', 'rights')}.
          </p>
        </div>
      </div>
    </footer>;
}