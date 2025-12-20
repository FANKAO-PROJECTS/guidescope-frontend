import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <motion.div
                animate={{
                    rotate: 360,
                    borderColor: ['hsl(var(--border-glass))', 'hsl(var(--sapphire))', 'hsl(var(--border-glass))']
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{
                    width: '48px',
                    height: '48px',
                    border: '3px solid hsl(var(--border-glass))',
                    borderTopColor: 'hsl(var(--sapphire))',
                    borderRadius: '50%'
                }}
            />
            <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-50 animate-pulse">
                Retrieving Insights
            </p>
        </div>
    );
};

export default LoadingSpinner;
