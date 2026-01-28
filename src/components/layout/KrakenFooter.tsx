import { Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Send, Instagram, Youtube, Twitter, Users } from 'lucide-react';

export function KrakenFooter() {
  const { t } = useTranslation();

  const footerLinks = {
    platform: [
      { href: '/catalog', label: t('nav', 'catalog') },
      { href: '/groups', label: t('nav', 'groups') },
      { href: '/news', label: t('nav', 'news') },
    ],
    about: [
      { href: '/about', label: t('nav', 'about') },
      { href: '/contact', label: t('common', 'contact') },
    ],
  };

  const socialLinks = [
    { icon: Send, href: '#', label: 'Telegram' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Twitter, href: '#', label: 'X/Twitter' },
  ];

  return (
    <footer className="bg-card border-t border-border relative overflow-hidden">
      {/* Decorative wave */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="kraken-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold kraken-gradient-text">Свій до своїх</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md mb-6">
              {t('footer', 'tagline')}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t('nav', 'catalog')}</h4>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">{t('nav', 'about')}</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Свій до своїх. {t('footer', 'rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
}
