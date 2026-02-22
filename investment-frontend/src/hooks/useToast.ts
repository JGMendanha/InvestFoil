import { useCallback } from 'react';
import { toast } from 'sonner';

export const useToast = () => {
    const success = useCallback((message: string) => {
        toast.success(message, {
            duration: 3000,
            position: 'top-right',
        });
    }, []);

    const error = useCallback((message: string) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
        });
    }, []);

    const warning = useCallback((message: string) => {
        toast.warning(message, {
            duration: 4000,
            position: 'top-right',
        });
    }, []);

    const info = useCallback((message: string) => {
        toast.info(message, {
            duration: 3000,
            position: 'top-right',
        });
    }, []);

    return { success, error, warning, info };
};