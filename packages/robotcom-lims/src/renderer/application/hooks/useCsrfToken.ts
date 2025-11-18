import { useState, useEffect } from 'react';
import SecurityService from '../../src/application/services/SecurityService';

const CSRF_TOKEN_STORAGE_KEY = 'csrf-token';
const CSRF_TOKEN_EXPIRY_KEY = 'csrf-token-expiry';
const CSRF_TOKEN_EXPIRY_MINUTES = 60; // Token expires after 1 hour

export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateOrRetrieveToken = () => {
      try {
        const now = Date.now();
        const storedToken = localStorage.getItem(CSRF_TOKEN_STORAGE_KEY);
        const expiryTime = localStorage.getItem(CSRF_TOKEN_EXPIRY_KEY);

        // Check if token exists and hasn't expired
        if (
          storedToken &&
          expiryTime &&
          parseInt(expiryTime, 10) > now
        ) {
          setCsrfToken(storedToken);
          setIsLoading(false);
          return;
        }

        // Generate new token using SecurityService
        const newToken = SecurityService.generateSecureToken();
        const expiryDate = new Date(now + CSRF_TOKEN_EXPIRY_MINUTES * 60 * 1000).getTime();

        localStorage.setItem(CSRF_TOKEN_STORAGE_KEY, newToken);
        localStorage.setItem(CSRF_TOKEN_EXPIRY_KEY, expiryDate.toString());

        setCsrfToken(newToken);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate CSRF token';
        setError(errorMessage);
        setCsrfToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    generateOrRetrieveToken();
  }, []);

  const refreshToken = () => {
    setIsLoading(true);
    try {
      const newToken = SecurityService.generateSecureToken();
      const expiryDate = new Date(Date.now() + CSRF_TOKEN_EXPIRY_MINUTES * 60 * 1000).getTime();

      localStorage.setItem(CSRF_TOKEN_STORAGE_KEY, newToken);
      localStorage.setItem(CSRF_TOKEN_EXPIRY_KEY, expiryDate.toString());

      setCsrfToken(newToken);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh CSRF token';
      setError(errorMessage);
      setCsrfToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { csrfToken, isLoading, error, refreshToken };
};
