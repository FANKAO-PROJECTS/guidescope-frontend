import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="search-box-wrapper">
            <Search
                className="absolute left-6 top-1/2 -translate-y-1/2 text-muted"
                size={20}
            />
            <input
                type="text"
                className="search-input-field"
                placeholder="What insight are you looking for today?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
            />
        </form>
    );
};

export default SearchBar;
