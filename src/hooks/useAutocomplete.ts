import { useState, useEffect, useCallback, useRef } from 'react';
import { getAutocompleteSuggestions, type AutocompleteSuggestion } from '../api/searchApi';

interface UseAutocompleteResult {
    suggestions: AutocompleteSuggestion[];
    isLoading: boolean;
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    clearSuggestions: () => void;
}

export function useAutocomplete(query: string, enabled: boolean): UseAutocompleteResult {
    const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    // Use ReturnType<typeof setTimeout> for better type safety across environments
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchSuggestions = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const results = await getAutocompleteSuggestions(searchQuery);
            setSuggestions(results);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Autocomplete fetch failed:', error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!enabled || query.length < 3) {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }

        // Debounce: wait 300ms after user stops typing
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [query, enabled, fetchSuggestions]);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
        setSelectedIndex(-1);
    }, []);

    return {
        suggestions,
        isLoading,
        selectedIndex,
        setSelectedIndex,
        clearSuggestions,
    };
}
