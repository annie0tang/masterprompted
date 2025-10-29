import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div className="flex gap-1">
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('en')}
          className="h-8 px-3"
        >
          EN
        </Button>
        <Button
          variant={language === 'es' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('es')}
          className="h-8 px-3"
        >
          ES
        </Button>
      </div>
    </div>
  );
};
