import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Dashboard } from '@/pages/Dashboard';
import { InvestmentForm } from '@/pages/InvestmentForm';
import { Reports } from '@/pages/Reports'; // <-- importe

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/investments/new" element={<InvestmentForm />} />
                <Route path="/investments/edit/:id" element={<InvestmentForm />} />
                <Route path="/reports" element={<Reports />} /> {/* nova rota */}
            </Routes>
            <Toaster richColors closeButton />
        </BrowserRouter>
    );
}

export default App;