import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import { Investment } from '@/services/investmentService';
import { formatCurrency, formatDate } from '@/utils/format';
import { Skeleton } from '@/components/ui/skeleton';

interface InvestmentTableProps {
    data: Investment[];
    loading?: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    onUpdatePrice: (id: number) => void;
}

const typeColors = {
    ACAO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    CRIPTO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    FUNDO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    RENDA_FIXA: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    OUTRO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export function InvestmentTable({
                                    data,
                                    loading = false,
                                    onEdit,
                                    onDelete,
                                    onUpdatePrice,
                                }: InvestmentTableProps) {
    if (loading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Nenhum ativo encontrado.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Símbolo</TableHead>
                        <TableHead>Quantidade</TableHead>
                        <TableHead>Preço Compra</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Data Compra</TableHead>
                        <TableHead>Preço Atual</TableHead>
                        <TableHead>Lucro/Prejuízo</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => {
                        const total = item.quantity * item.purchasePrice;
                        const profitLoss = item.profitLoss;
                        const profitLossColor =
                            profitLoss && profitLoss > 0
                                ? 'text-green-600 dark:text-green-400'
                                : profitLoss && profitLoss < 0
                                    ? 'text-red-600 dark:text-red-400'
                                    : '';

                        return (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Badge className={typeColors[item.type]}>
                                        {item.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{item.symbol}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{formatCurrency(item.purchasePrice)}</TableCell>
                                <TableCell>{formatCurrency(total)}</TableCell>
                                <TableCell>{formatDate(item.purchaseDate)}</TableCell>
                                <TableCell>
                                    {item.currentPrice ? formatCurrency(item.currentPrice) : '-'}
                                </TableCell>
                                <TableCell className={profitLossColor}>
                                    {profitLoss ? formatCurrency(profitLoss) : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onUpdatePrice(item.id)}
                                            title="Atualizar preço"
                                        >
                                            <TrendingUp className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(item.id)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}