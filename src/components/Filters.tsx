import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import type { SearchCapabilities } from '../api/searchApi';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface FiltersProps {
    capabilities: SearchCapabilities | null;
    type: string;
    setType: (type: string) => void;
    region: string;
    setRegion: (region: string) => void;
    field: string;
    setField: (field: string) => void;
    yearFrom: number | '';
    setYearFrom: (val: number | '') => void;
    yearTo: number | '';
    setYearTo: (val: number | '') => void;
}

const Filters: React.FC<FiltersProps> = ({
    capabilities, type, setType, region, setRegion, field, setField, yearFrom, setYearFrom, yearTo, setYearTo,
}) => {
    const { t } = useTranslation();
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

    const clearFilters = () => {
        setType('');
        setRegion('');
        setField('');
        setYearFrom('');
        setYearTo('');
    };

    const hasActiveFilters = !!(type || region || field || yearFrom || yearTo);

    const minYear = capabilities?.yearRange?.min || 1990;
    const maxYear = capabilities?.yearRange?.max || new Date().getFullYear();
    const years: string[] = [];
    for (let y = maxYear; y >= minYear; y--) {
        years.push(y.toString());
    }

    const FilterContent = () => (
        <>
            <div className="filter-group">
                <label className="filter-label">{t('filter.category')}</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="filter-select">
                    <option value="">{t('filter.category.all')}</option>
                    {capabilities?.types.map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">{t('filter.region')}</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} className="filter-select">
                    <option value="">{t('filter.region.any')}</option>
                    {capabilities?.regions.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">{t('filter.specialty')}</label>
                <select value={field} onChange={(e) => setField(e.target.value)} className="filter-select">
                    <option value="">{t('filter.specialty.any')}</option>
                    {capabilities?.fields.map(f => (
                        <option key={f} value={f}>{f}</option>
                    ))}
                </select>
            </div>

            <div className="flex gap-4">
                <div className="filter-group flex-1">
                    <label className="filter-label">{t('filter.start')}</label>
                    <select value={yearFrom} onChange={(e) => setYearFrom(e.target.value === '' ? '' : parseInt(e.target.value))} className="filter-select">
                        <option value="">{t('filter.year.any')}</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <div className="filter-group flex-1">
                    <label className="filter-label">{t('filter.end')}</label>
                    <select value={yearTo} onChange={(e) => setYearTo(e.target.value === '' ? '' : parseInt(e.target.value))} className="filter-select">
                        <option value="">{t('filter.year.any')}</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {hasActiveFilters && (
                <button onClick={clearFilters} className="btn-tertiary mt-2">
                    {t('filters.clear')}
                </button>
            )}
        </>
    );

    return (
        <div className="w-full">
            {/* Desktop Filter Bar - Hidden on mobile */}
            <div className="desktop-filters glass-effect filter-bar">
                <div className="flex items-center gap-2">
                    <Filter size={16} className="text-medical" />
                    <span className="filter-label">{t('filters.refine')}</span>
                </div>
                <FilterContent />
            </div>

            {/* Mobile Filter Toggle - Visible only on mobile */}
            <div className="mobile-filters">
                <button
                    onClick={() => setIsMobileDrawerOpen(true)}
                    className="w-full flex items-center justify-between px-6 py-4 glass-effect"
                >
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-medical" />
                        <span className="font-bold text-sm uppercase tracking-widest text-primary">{t('filters.dimensions')}</span>
                    </div>
                    {hasActiveFilters && (
                        <span className="filter-badge">!</span>
                    )}
                    <ChevronDown size={18} className="text-muted" />
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileDrawerOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileDrawerOpen(false)}
                            className="mobile-drawer-overlay"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="mobile-drawer"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold">{t('filters.refine')}</h3>
                                <button onClick={() => setIsMobileDrawerOpen(false)} className="p-2 -mr-2">
                                    <X size={24} className="text-muted" />
                                </button>
                            </div>
                            <div className="flex flex-col gap-6">
                                <FilterContent />
                                <button
                                    onClick={() => setIsMobileDrawerOpen(false)}
                                    className="w-full btn-secondary mt-4 font-bold"
                                >
                                    {t('filters.close_view')}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Filters;
