import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { investmentService } from '@/services/investmentService';
import { useToast } from '@/hooks/useToast';

const investmentSchema = z.object({
    type: z.enum(['ACAO', 'CRIPTO', 'FUNDO', 'RENDA_FIXA', 'OUTRO']),
    symbol: z.string().min(1, 'Símbolo é obrigatório'),
    quantity: z.number().positive('Quantidade deve ser positiva'),
    purchasePrice: z.number().positive('Preço deve ser positivo'),
    purchaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (use AAAA-MM-DD)'),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

export function InvestmentForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<InvestmentFormData>({
        resolver: zodResolver(investmentSchema),
        defaultValues: {
            type: 'ACAO',
            quantity: 1,
            purchasePrice: 0,
            purchaseDate: new Date().toISOString().split('T')[0],
        },
    });

    useEffect(() => {
        if (id) {
            setFetching(true);
            investmentService
                .getById(Number(id))
                .then((data) => {
                    setValue('type', data.type);
                    setValue('symbol', data.symbol);
                    setValue('quantity', data.quantity);
                    setValue('purchasePrice', data.purchasePrice);
                    setValue('purchaseDate', data.purchaseDate);
                })
                .catch(() => {
                    toastError('Erro ao carregar dados do ativo');
                })
                .finally(() => setFetching(false));
        }
    }, [id, setValue, toastError]);

    const onSubmit = async (data: InvestmentFormData) => {
        setLoading(true);
        try {
            if (id) {
                await investmentService.update(Number(id), data);
                success('Ativo atualizado com sucesso');
            } else {
                await investmentService.create(data);
                success('Ativo criado com sucesso');
            }
            navigate('/');
        } catch (error) {
            toastError('Erro ao salvar ativo');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-2xl">
                <Card>
                    <CardContent className="py-8">Carregando...</CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>{id ? 'Editar' : 'Novo'} Ativo</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo</Label>
                            <Select
                                onValueChange={(value) => setValue('type', value as any)}
                                defaultValue="ACAO"
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACAO">Ação</SelectItem>
                                    <SelectItem value="CRIPTO">Criptomoeda</SelectItem>
                                    <SelectItem value="FUNDO">Fundo</SelectItem>
                                    <SelectItem value="RENDA_FIXA">Renda Fixa</SelectItem>
                                    <SelectItem value="OUTRO">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-red-500">{errors.type.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="symbol">Símbolo</Label>
                            <Input
                                id="symbol"
                                {...register('symbol')}
                                placeholder="Ex: BBAS3, BTC"
                            />
                            {errors.symbol && (
                                <p className="text-sm text-red-500">{errors.symbol.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">Quantidade</Label>
                            <Input
                                id="quantity"
                                type="number"
                                step="0.01"
                                {...register('quantity', { valueAsNumber: true })}
                            />
                            {errors.quantity && (
                                <p className="text-sm text-red-500">{errors.quantity.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchasePrice">Preço de Compra (R$)</Label>
                            <Input
                                id="purchasePrice"
                                type="number"
                                step="0.01"
                                {...register('purchasePrice', { valueAsNumber: true })}
                            />
                            {errors.purchasePrice && (
                                <p className="text-sm text-red-500">
                                    {errors.purchasePrice.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="purchaseDate">Data de Compra</Label>
                            <Input
                                id="purchaseDate"
                                type="date"
                                {...register('purchaseDate')}
                            />
                            {errors.purchaseDate && (
                                <p className="text-sm text-red-500">
                                    {errors.purchaseDate.message}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/')}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}