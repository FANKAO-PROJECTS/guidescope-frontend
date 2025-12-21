import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchMetaProps {
    total: number;
    count: number;
    hasSearched: boolean;
    isStale?: boolean;
}

const SearchMeta: React.FC<SearchMetaProps> = ({ total, count, hasSearched, isStale }) => {
    if (!hasSearched) return null;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-2 gap-1">
                <div className="text-xs font-bold text-muted uppercase tracking-wider">
                    <span className="hidden sm:inline">Clinical Discovery: </span>
                    <span className="text-medical">{total}</span> Result{total !== 1 ? 's' : ''}
                </div>
                <div className="text-xs text-muted opacity-50 font-medium">
                    Displaying {count} document{count !== 1 ? 's' : ''}
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
                        <span className="hidden sm:inline">Results are stale. </span>
                        Press Enter to update<span className="hidden sm:inline"> results</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchMeta;
