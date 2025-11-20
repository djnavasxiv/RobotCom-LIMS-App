/**
 * useToast.ts - Custom React hook for toast notifications
 * 
 * Provides:
 * - Toast message management
 * - Auto-dismissal after timeout
 * - Multiple toast display support
 * - Success, error, warning, info types
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import { useCallback, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type: ToastType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

/**
 * Hook for managing toast notifications
 */
export const useToast = (): UseToastReturn => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = generateId();
      const newToast: Toast = {
        id,
        message,
        type,
        duration,
      };

      setToasts(prev => [...prev, newToast]);

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [generateId, removeToast]
  );

  const showSuccess = useCallback(
    (message: string, duration = 3000) => showToast(message, 'success', duration),
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration = 5000) => showToast(message, 'error', duration),
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration = 4000) => showToast(message, 'warning', duration),
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration = 3000) => showToast(message, 'info', duration),
    [showToast]
  );

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearToasts,
  };
};

export default useToast;
