import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { investmentService, Investment } from '@/services/investmentService';
import { formatCurrency } from '@/utils/format';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export function Reports() {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await investmentService.getAll();
            setInvestments(data);
        } catch (error) {
            console.error('Erro ao carregar dados para relatórios:', error);
        } finally {
            setLoading(false);
        }
    };

    // Cálculos
    const totalInvested = investments.reduce(
        (acc, inv) => acc + inv.quantity * inv.purchasePrice,
        0
    );

    const totalCurrentValue = investments.reduce((acc, inv) => {
        if (inv.currentPrice) {
            return acc + inv.quantity * inv.currentPrice;
        }
        return acc + inv.quantity * inv.purchasePrice;
    }, 0);

    const totalProfitLoss = totalCurrentValue - totalInvested;
    const profitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

    const winners = investments.filter(inv => inv.profitLoss && inv.profitLoss > 0);
    const losers = investments.filter(inv => inv.profitLoss && inv.profitLoss < 0);

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <p>Carregando relatórios</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold text-primary mb-8">Relatórios de ganhos e perdas</h1>

            {/* Cards de resumo */}
            <div className="grid gap-4 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalInvested)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor atual</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(totalCurrentValue)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lucro/Prejuízo</CardTitle>
                        {totalProfitLoss >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`text-2xl font-bold ${
                                totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {formatCurrency(totalProfitLoss)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {profitLossPercentage.toFixed(2)}% do total investido
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabela de ativos com lucro/prejuízo */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Detalhamento por ativo</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ativo</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Quantidade</TableHead>
                                <TableHead>Preço Compra</TableHead>
                                <TableHead>Preço Atual</TableHead>
                                <TableHead>Lucro/Prejuízo</TableHead>
                                <TableHead>Retorno %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {investments.map((inv) => {
                                const currentPrice = inv.currentPrice || inv.purchasePrice;
                                const profitLoss = inv.profitLoss || 0;
                                const percentReturn =
                                    inv.purchasePrice > 0
                                        ? ((currentPrice - inv.purchasePrice) / inv.purchasePrice) * 100
                                        : 0;

                                return (
                                    <TableRow key={inv.id}>
                                        <TableCell className="font-medium">{inv.symbol}</TableCell>
                                        <TableCell>{inv.type}</TableCell>
                                        <TableCell>{inv.quantity}</TableCell>
                                        <TableCell>{formatCurrency(inv.purchasePrice)}</TableCell>
                                        <TableCell>{formatCurrency(currentPrice)}</TableCell>
                                        <TableCell
                                            className={profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}
                                        >
                                            {formatCurrency(profitLoss)}
                                        </TableCell>
                                        <TableCell
                                            className={percentReturn >= 0 ? 'text-green-600' : 'text-red-600'}
                                        >
                                            {percentReturn.toFixed(2)}%
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-green-600">Ativos com ganho</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {winners.length > 0 ? (
                            <ul className="space-y-2">
                                {winners.map((inv) => (
                                    <li key={inv.id} className="flex justify-between">
                                        <span>{inv.symbol}</span>
                                        <span className="text-green-600">
                      {formatCurrency(inv.profitLoss!)}
                    </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">Nenhum ativo com ganho.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Ativos com perda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {losers.length > 0 ? (
                            <ul className="space-y-2">
                                {losers.map((inv) => (
                                    <li key={inv.id} className="flex justify-between">
                                        <span>{inv.symbol}</span>
                                        <span className="text-red-600">
                      {formatCurrency(inv.profitLoss!)}
                    </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground">Nenhum ativo com perda.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}