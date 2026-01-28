import { Send, Instagram, Youtube, Twitter, Globe, Mail, MessageCircle, Facebook, Linkedin, Github } from 'lucide-react';

interface SocialIconProps {
  platform: string;
  className?: string;
}

export function SocialIcon({ platform, className = 'h-5 w-5' }: SocialIconProps) {
  const lowerPlatform = platform.toLowerCase();

  switch (lowerPlatform) {
    case 'telegram':
      return <Send className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'twitter':
    case 'x':
      return <Twitter className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'github':
      return <Github className={className} />;
    case 'email':
      return <Mail className={className} />;
    case 'whatsapp':
      return <MessageCircle className={className} />;
    case 'website':
    default:
      return <Globe className={className} />;
  }
}

export function getSocialUrl(platform: string, value: string): string {
  const lowerPlatform = platform.toLowerCase();

  // If it's already a full URL, return as-is
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  switch (lowerPlatform) {
    case 'telegram':
      return `https://t.me/${value.replace('@', '')}`;
    case 'instagram':
      return `https://instagram.com/${value.replace('@', '')}`;
    case 'youtube':
      return value.includes('/') ? `https://youtube.com/${value}` : `https://youtube.com/@${value}`;
    case 'twitter':
    case 'x':
      return `https://x.com/${value.replace('@', '')}`;
    case 'facebook':
      return `https://facebook.com/${value}`;
    case 'linkedin':
      return `https://linkedin.com/in/${value}`;
    case 'github':
      return `https://github.com/${value}`;
    case 'email':
      return `mailto:${value}`;
    case 'whatsapp':
      return `https://wa.me/${value.replace(/[^0-9]/g, '')}`;
    case 'website':
    default:
      return value.startsWith('http') ? value : `https://${value}`;
  }
}
