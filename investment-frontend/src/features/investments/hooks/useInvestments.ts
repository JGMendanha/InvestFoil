import { useState, useEffect, useCallback } from 'react';
import { investmentService, Investment, Summary } from '@/services/investmentService';
import { useToast } from '@/hooks/useToast';

export function useInvestments() {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string | undefined>();
    const { error: toastError, success } = useToast();

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [investmentsData, summaryData] = await Promise.all([
                investmentService.getAll(filterType),
                investmentService.getSummary(),
            ]);
            setInvestments(investmentsData);
            setSummary(summaryData);
        } catch (err) {
            const message = 'Erro ao carregar dados da carteira';
            setError(message);
            toastError(message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filterType, toastError]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const deleteInvestment = async (id: number) => {
        try {
            await investmentService.delete(id);
            success('Ativo removido com sucesso');
            loadData();
        } catch (err) {
            toastError('Erro ao remover ativo');
        }
    };

    const updatePrice = async (id: number, newPrice: number) => {
        try {
            await investmentService.updatePrice(id, newPrice);
            success('Preço atualizado com sucesso');
            loadData();
        } catch (err) {
            toastError('Erro ao atualizar preço');
        }
    };

    return {
        investments,
        summary,
        loading,
        error,
        filterType,
        setFilterType,
        deleteInvestment,
        updatePrice,
        refresh: loadData,
    };
}