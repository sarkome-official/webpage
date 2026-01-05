import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="w-4 h-4" />
      <div className="flex gap-1">
        <Button
          variant={i18n.language === 'en' ? 'default' : 'outline'}
          size="sm"
          onClick={() => changeLanguage('en')}
          className="h-7 px-2 text-xs"
          title="English"
        >
          EN
        </Button>
        <Button
          variant={i18n.language === 'es' ? 'default' : 'outline'}
          size="sm"
          onClick={() => changeLanguage('es')}
          className="h-7 px-2 text-xs"
          title="Español"
        >
          ES
        </Button>
        <Button
          variant={i18n.language === 'pt' ? 'default' : 'outline'}
          size="sm"
          onClick={() => changeLanguage('pt')}
          className="h-7 px-2 text-xs"
          title="Português"
        >
          PT
        </Button>
      </div>
    </div>
  );
};
