import { api } from './api';

export interface Investment {
    id: number;
    type: 'ACAO' | 'CRIPTO' | 'FUNDO' | 'RENDA_FIXA' | 'OUTRO';
    symbol: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
    currentPrice?: number;
    profitLoss?: number;
}

export interface InvestmentRequest {
    type: Investment['type'];
    symbol: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
}

export interface Summary {
    totalInvested: number;
    totalByType: Record<string, number>;
    assetCount: number;
}

export const investmentService = {
    getAll: async (type?: string) => {
        const params = type ? { type } : {};
        const response = await api.get<Investment[]>('/investments', { params });
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<Investment>(`/investments/${id}`);
        return response.data;
    },

    create: async (data: InvestmentRequest) => {
        const response = await api.post<Investment>('/investments', data);
        return response.data;
    },

    update: async (id: number, data: InvestmentRequest) => {
        const response = await api.put<Investment>(`/investments/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        await api.delete(`/investments/${id}`);
    },

    getSummary: async () => {
        const response = await api.get<Summary>('/investments/summary');
        return response.data;
    },

    updatePrice: async (id: number, newPrice: number) => {
        const response = await api.patch<Investment>(`/investments/${id}/price?newPrice=${newPrice}`);
        return response.data;
    }
};