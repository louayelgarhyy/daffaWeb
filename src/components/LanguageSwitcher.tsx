import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Languages } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation('common');

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const currentLanguageLabel = i18n.language === 'ar' ? 'EN' : 'ع';

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-1 font-semibold"
      aria-label={t('language.switchTo')}
    >
      <Languages className="h-4 w-4" />
      <span>{currentLanguageLabel}</span>
    </Button>
  );
};
