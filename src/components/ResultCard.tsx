import React from 'react';
import { ExternalLink } from 'lucide-react';
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
                        {result.type}
                    </span>
                    <ExternalLink size={14} className="text-medical opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-lg font-bold leading-tight group-hover:text-medical transition-colors text-primary">
                    {result.title}
                </h3>

                <div className="flex items-center gap-2 text-xs font-semibold text-muted">
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
        </motion.a>
    );
};

export default ResultCard;
