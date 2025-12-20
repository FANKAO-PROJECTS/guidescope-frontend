import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Tag } from 'lucide-react';
import type { SearchResult } from '../api/searchApi';

interface ResultCardProps {
    result: SearchResult;
    index: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="glass-effect p-8 flex flex-col justify-between hover:border-sapphire transition-all group cursor-pointer"
            onClick={() => window.open(result.link, '_blank')}
        >
            <div className="mb-4">
                <div className="flex justify-between items-start mb-6">
                    <span className="card-tag">{result.type}</span>
                    <ExternalLink size={16} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="text-lg font-bold mb-4 leading-tight group-hover:text-sapphire transition-colors">
                    {result.title}
                </h3>

                <div className="flex gap-4 items-center text-xs text-muted mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {result.year}
                    </div>
                    {result.keywords && result.keywords.length > 0 && (
                        <div className="flex items-center gap-1 overflow-hidden">
                            <Tag size={12} />
                            <div className="flex gap-1">
                                {result.keywords.slice(0, 2).map((k, i) => (
                                    <span key={i} className="bg-white/5 px-1.5 py-0.5 rounded opacity-70">{k}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <div className="progress-track">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(result.score * 100, 100)}%` }}
                        className="progress-fill"
                    />
                </div>
                <div className="flex justify-between items-center mt-2 opacity-50">
                    <span className="text-[9px] font-black uppercase tracking-widest">Relevance Index</span>
                    <span className="text-[9px] font-mono">{(result.score * 100).toFixed(1)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ResultCard;
