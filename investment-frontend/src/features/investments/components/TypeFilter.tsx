import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface TypeFilterProps {
    value?: string;
    onChange: (value: string | undefined) => void;
}

const investmentTypes = [
    { value: 'ACAO', label: 'Ações' },
    { value: 'CRIPTO', label: 'Criptomoedas' },
    { value: 'FUNDO', label: 'Fundos' },
    { value: 'RENDA_FIXA', label: 'Renda Fixa' },
    { value: 'OUTRO', label: 'Outros' },
];

export function TypeFilter({ value, onChange }: TypeFilterProps) {
    return (
        <Select
            value={value || 'all'}
            onValueChange={(val) => onChange(val === 'all' ? undefined : val)}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {investmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                        {type.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}