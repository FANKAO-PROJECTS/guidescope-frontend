import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface SystemStats {
    visitCount: number;
    searchCount: number;
}

export const getStats = async (): Promise<SystemStats> => {
    const response = await api.get<SystemStats>('/api/stats');
    return response.data;
};

export const recordVisit = async (): Promise<void> => {
    await api.post('/api/stats/visit');
};
