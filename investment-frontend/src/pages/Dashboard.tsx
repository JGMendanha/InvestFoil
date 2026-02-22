import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { SummaryCards } from '@/features/investments/components/SummaryCards';
import { InvestmentTable } from '@/features/investments/components/InvestmentTable';
import { TypeFilter } from '@/features/investments/components/TypeFilter';
import { useInvestments } from "@/features/investments/hooks/useInvestments";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DashboardSkeleton } from '@/components/common/LoadingSkeleton';

export function Dashboard() {
    const navigate = useNavigate();
    const {
        investments,
        summary,
        loading,
        filterType,
        setFilterType,
        deleteInvestment,
        updatePrice,
    } = useInvestments();

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [updatePriceId, setUpdatePriceId] = useState<number | null>(null);
    const [newPrice, setNewPrice] = useState<string>('');

    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteInvestment(deleteId);
        setDeleteId(null);
    };

    const handleUpdatePrice = async () => {
        if (!updatePriceId || !newPrice) return;
        await updatePrice(updatePriceId, parseFloat(newPrice));
        setUpdatePriceId(null);
        setNewPrice('');
    };

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
                <Button onClick={() => navigate('/investments/new')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Ativo
                </Button>
            </div>

            {summary && <SummaryCards {...summary} />}

            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Seus ativos</h2>
                    <TypeFilter value={filterType} onChange={setFilterType} />
                </div>
                <InvestmentTable
                    data={investments}
                    loading={loading}
                    onEdit={(id) => navigate(`/investments/edit/${id}`)}
                    onDelete={(id) => setDeleteId(id)}
                    onUpdatePrice={(id) => setUpdatePriceId(id)}
                />
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. O ativo será permanentemente
                            removido.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={!!updatePriceId} onOpenChange={() => setUpdatePriceId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Atualizar preço de mercado</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium">
                                Novo preço (R$)
                            </label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setUpdatePriceId(null)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdatePrice}>Salvar</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}