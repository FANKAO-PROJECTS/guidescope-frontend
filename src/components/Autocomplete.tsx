import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { AutocompleteSuggestion } from '../api/searchApi';

interface AutocompleteProps {
    suggestions: AutocompleteSuggestion[];
    selectedIndex: number;
    onSelect: (suggestion: AutocompleteSuggestion) => void;
    onMouseEnter?: (index: number) => void;
    query: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    suggestions,
    selectedIndex,
    onSelect,
    onMouseEnter,
    query,
}) => {
    // Don't render anything if there are no suggestions
    // This is handled in the return statement with conditional rendering

    const highlightMatch = (text: string, query: string) => {
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);

        if (index === -1) return text;

        return (
            <>
                {text.substring(0, index)}
                <span className="autocomplete-highlight">{text.substring(index, index + query.length)}</span>
                {text.substring(index + query.length)}
            </>
        );
    };

    return (
        <AnimatePresence>
            {suggestions.length > 0 && (
                <motion.div
                    key="autocomplete-dropdown"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="autocomplete-dropdown"
                >
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={suggestion.slug}
                            className={`autocomplete-item ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(suggestion);
                            }}
                            onMouseEnter={() => onMouseEnter?.(index)}
                            onMouseDown={(e) => {
                                // Stop propagation to prevent click-outside handler from firing
                                // But don't preventDefault to allow click event to fire
                                e.stopPropagation();
                            }}
                        >
                            {highlightMatch(suggestion.title, query)}
                        </div>
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Autocomplete;
