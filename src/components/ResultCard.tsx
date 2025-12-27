import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { SearchResult } from '../api/searchApi';

interface ResultCardProps {
    result: SearchResult;
    index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
    return (
        <motion.a
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-effect group block overflow-hidden result-card-padding hover:shadow-xl transition-all duration-300 w-full no-underline"
        >
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                    <span className="card-tag">
                        {useTranslation().t(`category.${result.type.toLowerCase()}`, result.type)}
                    </span>
                    <ExternalLink size={14} className="text-medical opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-lg font-bold leading-tight group-hover:text-medical transition-colors text-primary">
                    {result.title}
                </h3>

                <div className="flex flex-col gap-1 text-xs text-muted">
                    {(result.authors || result.source) && (
                        <div className="font-medium text-primary/80 line-clamp-1">
                            {result.authors}{result.authors && result.source ? ' • ' : ''}{result.source}
                        </div>
                    )}
                    <div className="flex items-center gap-2 font-semibold">
                        <span>{result.year}</span>
                        {result.region && (
                            <>
                                <span className="opacity-20">•</span>
                                <span>{result.region}</span>
                            </>
                        )}
                        {result.field && (
                            <div className="ml-auto opacity-40 font-medium">{result.field}</div>
                        )}
                    </div>
                </div>
                {result.citation && (
                    <p className="text-[10px] text-muted opacity-50 italic line-clamp-1 border-t border-white/5 pt-2 mt-1">
                        {result.citation}
                    </p>
                )}
            </div>
        </motion.a>
    );
};

export default ResultCard;
