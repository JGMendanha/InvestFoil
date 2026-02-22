import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function Header() {
    const navigate = useNavigate();

    return (
        <header className="border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-primary">
                        Invest<span className="text-blue-600">Folio</span>
                    </h1>
                </div>

                <nav className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        Dashboard
                    </Button>
                    <Button variant="ghost" onClick={() => navigate('/reports')}>
                        Relatórios
                    </Button>
                </nav>
            </div>
        </header>
    );
}