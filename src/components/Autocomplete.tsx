import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AutocompleteProps {
    suggestions: string[];
    selectedIndex: number;
    onSelect: (suggestion: string) => void;
    onClose: () => void;
    query: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    suggestions,
    selectedIndex,
    onSelect,
    onClose,
    query,
}) => {
    if (suggestions.length === 0) return null;

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
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="autocomplete-dropdown"
            >
                {suggestions.map((suggestion, index) => (
                    <div
                        key={suggestion}
                        className={`autocomplete-item ${index === selectedIndex ? 'selected' : ''}`}
                        onClick={() => onSelect(suggestion)}
                        onMouseEnter={() => { }}
                    >
                        {highlightMatch(suggestion, query)}
                    </div>
                ))}
            </motion.div>
        </AnimatePresence>
    );
};

export default Autocomplete;
