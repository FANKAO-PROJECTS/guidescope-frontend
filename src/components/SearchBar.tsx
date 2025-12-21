import React, { useRef, useEffect } from 'react';
import Autocomplete from './Autocomplete';
import { useAutocomplete } from '../hooks/useAutocomplete';

interface SearchBarProps {
    query: string;
    setQuery: (val: string) => void;
    onSearch: (query: string) => void;
    isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { suggestions, selectedIndex, setSelectedIndex, clearSuggestions } = useAutocomplete(query, true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const searchTerm = selectedIndex >= 0 ? suggestions[selectedIndex] : query.trim();
        clearSuggestions();
        onSearch(searchTerm);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(Math.min(selectedIndex + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(Math.max(selectedIndex - 1, -1));
        } else if (e.key === 'Escape') {
            e.preventDefault();
            clearSuggestions();
        }
    };

    const handleSuggestionSelect = (suggestion: string) => {
        setQuery(suggestion);
        clearSuggestions();
        onSearch(suggestion);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                clearSuggestions();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [clearSuggestions]);

    return (
        <div className="w-full relative" ref={inputRef}>
            <form onSubmit={handleSubmit} className="w-full">
                <input
                    type="text"
                    className="search-input-field !px-8 !py-3"
                    placeholder="Search clinical guidelines, or browse using filters"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    autoFocus
                />
            </form>
            <Autocomplete
                suggestions={suggestions}
                selectedIndex={selectedIndex}
                onSelect={handleSuggestionSelect}
                query={query}
            />
        </div>
    );
};

export default SearchBar;
