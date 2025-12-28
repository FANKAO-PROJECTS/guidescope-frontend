import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-muted hover:text-primary transition-colors"
            title="Switch Language"
        >
            <span className="text-xs mr-1 opacity-70">{t('language.title')}</span>
            <Globe size={16} />
            <span className="uppercase">{i18n.language === 'vi' ? 'VN' : 'US'}</span>
        </button>
    );
};

export default LanguageSwitcher;
