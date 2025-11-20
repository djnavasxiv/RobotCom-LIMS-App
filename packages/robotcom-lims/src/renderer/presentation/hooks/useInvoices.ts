import { useState, useEffect, useCallback } from 'react';
import { InvoiceService } from '../../application/services/InvoiceService';
import { Invoice } from '../../domain/entities/Invoice';

export interface UseInvoicesReturn {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInvoices = (): UseInvoicesReturn => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invoiceService = new InvoiceService();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await invoiceService.getAllInvoices();
      setInvoices(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch invoices';
      setError(message);
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    invoices,
    loading,
    error,
    refetch,
  };
};
