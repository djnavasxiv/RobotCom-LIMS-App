import React, { Component, ReactNode } from 'react';
import LoggerService from '../../application/services/LoggerService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    LoggerService.error(
      'Component Error Caught',
      error,
      'ErrorBoundary'
    );

    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '2rem',
              background: '#fff3cd',
              border: '1px solid #ffc107',
              borderRadius: '8px',
              margin: '1rem'
            }}
          >
            <h2 style={{ color: '#856404', marginTop: 0 }}>⚠️ Algo salió mal</h2>
            <p style={{ color: '#856404' }}>
              Ocurrió un error inesperado. Por favor, intenta recargar la página.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 'bold', color: '#856404' }}>
                  Detalles del Error
                </summary>
                <pre
                  style={{
                    background: '#fff',
                    padding: '1rem',
                    borderRadius: '4px',
                    overflow: 'auto',
                    fontSize: '0.85rem'
                  }}
                >
                  {this.state.error?.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#ffc107',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#856404'
              }}
            >
              Recargar Página
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
