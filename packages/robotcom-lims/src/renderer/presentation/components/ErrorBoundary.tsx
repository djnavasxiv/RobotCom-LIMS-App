/**
 * ErrorBoundary.tsx - Error Boundary Component
 * 
 * Provides graceful error handling for React components with:
 * - Error catching and logging
 * - User-friendly error messages
 * - Fallback UI with recovery options
 * - Development error details
 * 
 * Author: David Navas
 * Date: November 19, 2025
 */

import React, { ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component - Catches errors in child components
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Log error details
    console.error('Error Boundary caught an error:', error);
    console.error('Error Info:', errorInfo);

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error boundary if resetKeys change
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      !arraysEqual(this.props.resetKeys, prevProps.resetKeys)
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 0v2m0-6v-2m0 0V7m0 6h4m-6 0H7" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
            </div>

            <p className="text-gray-600 mb-4">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>

            {this.state.error && (
              <div className="mb-4 p-3 bg-gray-100 rounded border border-gray-300">
                <p className="font-mono text-sm text-gray-700 break-words">{this.state.error.toString()}</p>
              </div>
            )}

            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mb-4 p-3 bg-gray-100 rounded border border-gray-300">
                <summary className="cursor-pointer font-semibold text-gray-900">Error Details (Development)</summary>
                <pre className="mt-2 text-xs text-gray-700 overflow-auto max-h-48">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.resetErrorBoundary}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Helper function to compare arrays for reset detection
 */
function arraysEqual(arr1: Array<string | number>, arr2: Array<string | number>): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, idx) => val === arr2[idx]);
}

export default ErrorBoundary;
