import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SearchMetaProps {
    total: number;
    count: number;
    hasSearched: boolean;
    isStale?: boolean;
}

const SearchMeta: React.FC<SearchMetaProps> = ({ total, count, hasSearched, isStale }) => {
    const { t } = useTranslation();

    if (!hasSearched) return null;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 gap-1">
                <div className="text-xs font-bold text-muted uppercase tracking-wider">
                    <span className="hidden sm:inline">{t('meta.discovery')}: </span>
                    <span className="text-medical">{total}</span> {total !== 1 ? t('results.title') : t('results.title')}
                </div>
                <div className="text-xs text-muted opacity-50 font-medium">
                    {t('meta.displaying')} {count} {count !== 1 ? t('meta.documents') : t('meta.document')}
                </div>
            </div>
            <AnimatePresence>
                {isStale && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="stale-indicator"
                    >
                        <span className="animate-pulse">●</span>
                        <span className="hidden sm:inline">{t('meta.stale')} </span>
                        {t('meta.press_enter')}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchMeta;
