import { useState, useEffect, useCallback } from 'react';
import { InventoryService } from '../../application/services/InventoryService';
import { InventoryItem } from '../../domain/entities/InventoryItem';

export interface UseInventoryReturn {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useInventory = (): UseInventoryReturn => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inventoryService = new InventoryService();

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await inventoryService.getAllItems();
      setItems(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch inventory';
      setError(message);
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    items,
    loading,
    error,
    refetch,
  };
};
