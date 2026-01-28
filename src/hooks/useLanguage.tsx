// Re-export from new i18n system for backward compatibility
import { useTranslation, I18nProvider } from '@/lib/i18n/useTranslation';
import { translations, Language } from '@/lib/i18n/translations';

// Create a compatibility layer that wraps the new API
export function useLanguage() {
  const { language, setLanguage, t: newT } = useTranslation();
  
  // Create a compatibility t function that takes a single key like 'about.title'
  // and maps it to the new format t('about', 'title')
  const t = (key: string): string => {
    // Map old-style keys to new format
    const keyMap: Record<string, [string, string]> = {
      // Navigation
      'nav.catalog': ['nav', 'catalog'],
      'nav.communication': ['nav', 'communication'],
      'nav.cooperation': ['nav', 'cooperation'],
      'nav.about': ['nav', 'about'],
      'nav.contact': ['nav', 'contact'],
      'nav.login': ['nav', 'login'],
      'nav.signup': ['nav', 'signup'],
      'nav.logout': ['nav', 'logout'],
      'nav.admin': ['nav', 'admin'],
      'nav.groups': ['nav', 'groups'],
      'nav.projects': ['nav', 'projects'],
      'nav.news': ['nav', 'news'],
      'nav.dashboard': ['nav', 'dashboard'],
      
      // Hero
      'hero.title': ['hero', 'title'],
      'hero.subtitle': ['hero', 'subtitle'],
      'hero.cta': ['hero', 'cta'],
      'hero.secondary': ['hero', 'secondary'],
      'hero.go': ['hero', 'go'],
      
      // Features
      'features.catalog.title': ['features', 'catalog_title'],
      'features.catalog.desc': ['features', 'catalog_desc'],
      'features.projects.title': ['features', 'projects_title'],
      'features.projects.desc': ['features', 'projects_desc'],
      'features.trust.title': ['features', 'trust_title'],
      'features.trust.desc': ['features', 'trust_desc'],
      
      // Stats
      'stats.groups': ['stats', 'groups'],
      'stats.projects': ['stats', 'projects'],
      'stats.participants': ['stats', 'participants'],
      
      // Values
      'values.title': ['values', 'title'],
      'values.subtitle': ['values', 'subtitle'],
      'values.verification': ['values', 'verification'],
      'values.verification.desc': ['values', 'verification_desc'],
      'values.transparency': ['values', 'transparency'],
      'values.transparency.desc': ['values', 'transparency_desc'],
      'values.horizontality': ['values', 'horizontality'],
      'values.horizontality.desc': ['values', 'horizontality_desc'],
      
      // CTA
      'cta.title': ['cta', 'title'],
      'cta.subtitle': ['cta', 'subtitle'],
      
      // Catalog
      'catalog.title': ['catalog', 'title'],
      'catalog.subtitle': ['catalog', 'subtitle'],
      'catalog.empty': ['catalog', 'empty'],
      'catalog.expertise': ['catalog', 'expertise'],
      'catalog.contact': ['catalog', 'contact'],
      
      // Cooperation
      'cooperation.title': ['cooperation', 'title'],
      'cooperation.subtitle': ['cooperation', 'subtitle'],
      'cooperation.empty': ['cooperation', 'empty'],
      'cooperation.join': ['cooperation', 'join'],
      'cooperation.requirements': ['cooperation', 'requirements'],
      'cooperation.status.open': ['cooperation', 'status_open'],
      'cooperation.status.in_progress': ['cooperation', 'status_in_progress'],
      'cooperation.status.closed': ['cooperation', 'status_closed'],
      
      // Communication
      'communication.title': ['communication', 'title'],
      'communication.subtitle': ['communication', 'subtitle'],
      'communication.coming': ['communication', 'coming'],
      
      // About
      'about.title': ['about', 'title'],
      'about.manifesto.title': ['about', 'manifesto_title'],
      'about.manifesto.p1': ['about', 'manifesto_p1'],
      'about.manifesto.p2': ['about', 'manifesto_p2'],
      'about.manifesto.p3': ['about', 'manifesto_p3'],
      'about.values.title': ['about', 'values_title'],
      'about.values.horizontal': ['about', 'values_horizontal'],
      'about.values.horizontal.desc': ['about', 'values_horizontal_desc'],
      'about.values.transparency': ['about', 'values_transparency'],
      'about.values.transparency.desc': ['about', 'values_transparency_desc'],
      'about.values.responsibility': ['about', 'values_responsibility'],
      'about.values.responsibility.desc': ['about', 'values_responsibility_desc'],
      
      // Contact
      'contact.title': ['contact', 'title'],
      'contact.subtitle': ['contact', 'subtitle'],
      'contact.name': ['contact', 'name'],
      'contact.email': ['contact', 'email'],
      'contact.topic': ['contact', 'topic'],
      'contact.message': ['contact', 'message'],
      'contact.submit': ['contact', 'submit'],
      'contact.success': ['contact', 'success'],
      'contact.error': ['contact', 'error'],
      
      // Common
      'common.loading': ['common', 'loading'],
      'common.error': ['common', 'error'],
      'common.back': ['common', 'back'],
      'common.submit': ['common', 'submit'],
      'common.cancel': ['common', 'cancel'],
    };
    
    const mapping = keyMap[key];
    if (mapping) {
      return newT(mapping[0] as any, mapping[1]);
    }
    
    // Try to parse the key directly (section.key format)
    const parts = key.split('.');
    if (parts.length >= 2) {
      const section = parts[0];
      const subKey = parts.slice(1).join('_');
      try {
        return newT(section as any, subKey);
      } catch {
        return key;
      }
    }
    
    return key;
  };
  
  return { language, setLanguage, t };
}

// Re-export the provider with a different name for compatibility
export const LanguageProvider = I18nProvider;

export type { Language };
