import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('en')}
        className={`h-8 px-4 rounded-full transition-all ${
          language === 'en' 
            ? 'bg-white text-black hover:bg-white/90' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        EN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage('es')}
        className={`h-8 px-4 rounded-full transition-all ${
          language === 'es' 
            ? 'bg-white text-black hover:bg-white/90' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        ES
      </Button>
    </div>
  );
};
