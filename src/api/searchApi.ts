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
    slug?: string;
    exact?: boolean;
}

export interface SearchResult {
    id: string;
    type: string;
    region?: string;
    field?: string;
    title: string;
    year: number;
    link: string;
    authors?: string;
    source?: string;
    citation?: string;
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

export interface AutocompleteSuggestion {
    title: string;
    slug: string;
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

export const getAutocompleteSuggestions = async (query: string, filters?: SearchParams): Promise<AutocompleteSuggestion[]> => {
    try {
        const params = {
            q: query,
            ...filters
        };
        // Filter out undefined/null params from the spread filters
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v != null)
        );

        const response = await api.get<{ suggestions: AutocompleteSuggestion[] }>('/search/autocomplete', {
            params: cleanParams,
        });
        // Ensure we always return an array, even if the response structure is unexpected
        return response.data?.suggestions || [];
    } catch (error) {
        // Log error for debugging but don't throw - return empty array instead
        // This allows the UI to continue working even if autocomplete fails
        if (axios.isAxiosError(error)) {
            console.warn('Autocomplete API error:', error.response?.status, error.response?.data);
        } else {
            console.warn('Autocomplete error:', error);
        }
        return [];
    }
};

export default api;
