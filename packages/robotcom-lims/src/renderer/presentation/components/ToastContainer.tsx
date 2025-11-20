/**
 * ToastContainer.tsx - Toast Notification Display Component
 * 
 * Displays and manages toast notifications with:
 * - Multiple simultaneous toasts
 * - Auto-dismiss with progress bar
 * - Success, error, warning, info styling
 * - Dismissal actions
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import React, { FC } from 'react';
import { Toast, ToastType } from '../hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

/**
 * Individual toast component
 */
const ToastItem: FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const config: Record<ToastType, { bg: string; border: string; icon: React.ReactNode; text: string }> = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: (
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
        </svg>
      ),
      text: 'text-green-800',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: (
        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
        </svg>
      ),
      text: 'text-red-800',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: (
        <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
        </svg>
      ),
      text: 'text-yellow-800',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
        </svg>
      ),
      text: 'text-blue-800',
    },
  };

  const c = config[toast.type];
  const progressDuration = toast.duration || 4000;

  return (
    <div className={`${c.bg} border ${c.border} rounded-lg shadow-lg p-4 mb-3 relative overflow-hidden`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{c.icon}</div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${c.text}`}>{toast.message}</p>
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className={`text-sm font-semibold mt-2 ${c.text} hover:opacity-80`}
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={onRemove}
          className={`flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>
      {progressDuration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-current opacity-50 animate-shrink"
          style={{
            animation: `shrink ${progressDuration}ms linear forwards`,
            backgroundColor: toast.type === 'success' ? '#16a34a' :
              toast.type === 'error' ? '#dc2626' :
              toast.type === 'warning' ? '#ca8a04' :
              '#2563eb',
          }}
        />
      )}
    </div>
  );
};

/**
 * Toast Container Component - Displays all toasts
 */
export const ToastContainer: FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
