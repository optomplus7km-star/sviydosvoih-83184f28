import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center rounded-md border border-border">
      <Button
        variant={language === 'ru' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 rounded-r-none px-3 text-xs"
        onClick={() => setLanguage('ru')}
      >
        RU
      </Button>
      <Button
        variant={language === 'ua' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 rounded-l-none px-3 text-xs"
        onClick={() => setLanguage('ua')}
      >
        UA
      </Button>
    </div>
  );
}
