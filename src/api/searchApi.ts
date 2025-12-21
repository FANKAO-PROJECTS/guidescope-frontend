import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface SearchParams {
    q?: string;
    type?: string;
    region?: string;
    field?: string;
    year_from?: number;
    year_to?: number;
    limit?: number;
    offset?: number;
}

export interface SearchResult {
    id: string;
    type: string;
    region?: string;
    field?: string;
    title: string;
    year: number;
    link: string;
    keywords: string[];
}

export interface SearchCapabilities {
    types: string[];
    regions: string[];
    fields: string[];
    yearRange: {
        min: number;
        max: number;
    } | null;
}

export interface SearchResponse {
    results: SearchResult[];
    total: number;
    limit: number;
    offset: number;
}

export const searchDocuments = async (params: SearchParams): Promise<SearchResponse> => {
    // Filter out undefined/null params
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v != null)
    );

    const response = await api.get<SearchResponse>('/search', { params: cleanParams });
    return response.data;
};

export const getCapabilities = async (): Promise<SearchCapabilities> => {
    const response = await api.get<SearchCapabilities>('/search/capabilities');
    return response.data;
};

export const getAutocompleteSuggestions = async (query: string): Promise<string[]> => {
    const response = await api.get<{ suggestions: string[] }>('/search/autocomplete', {
        params: { q: query },
    });
    return response.data.suggestions;
};

export default api;
