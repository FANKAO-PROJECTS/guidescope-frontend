import React, { useRef, useEffect } from 'react';
import Autocomplete from './Autocomplete';
import { useAutocomplete } from '../hooks/useAutocomplete';
import { useTranslation } from 'react-i18next';
import type { AutocompleteSuggestion } from '../api/searchApi';

interface SearchBarProps {
    query: string;
    setQuery: (val: string) => void;
    onSearch: (query: string, exact?: boolean) => void;
    isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading }) => {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const { suggestions, selectedIndex, setSelectedIndex, clearSuggestions } = useAutocomplete(query, true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            // If a suggestion is selected, use its title for the search
            const selectedSuggestion = suggestions[selectedIndex];
            clearSuggestions();
            onSearch(selectedSuggestion.title, true); // Exact match if selected from list
        } else {
            // Otherwise, use the typed query
            const searchTerm = query.trim();
            clearSuggestions();
            onSearch(searchTerm, false); // Normal search if typed manually
        }
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

    const handleSuggestionSelect = (suggestion: AutocompleteSuggestion) => {
        // Set the query to the suggestion's title when user clicks on it
        setQuery(suggestion.title);
        clearSuggestions();
        onSearch(suggestion.title, true); // Exact match if clicked
    };

    useEffect(() => {
        // Only attach click-outside handler when there are suggestions visible
        if (suggestions.length === 0) return;

        const handleClickOutside = (e: MouseEvent) => {
            // Check if the click is outside the search bar container
            // The dropdown is a child of inputRef, so clicks on it are considered "inside"
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                clearSuggestions();
            }
        };

        // Use a small delay to ensure dropdown item clicks are processed first
        // This prevents the dropdown from closing immediately when clicking on an item
        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [suggestions.length, clearSuggestions]);

    return (
        <div className="w-full relative" ref={inputRef}>
            <form onSubmit={handleSubmit} className="w-full">
                <input
                    type="text"
                    className="search-input-field !px-8 !py-3"
                    placeholder={t('search.placeholder')}
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
                onMouseEnter={setSelectedIndex}
                query={query}
            />
        </div>
    );
};

export default SearchBar;
