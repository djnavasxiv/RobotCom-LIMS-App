import { useCallback } from 'react';

interface EmailPayload {
  to?: string;
  patientName: string;
  patientEmail: string;
  sampleId: string;
  results: Array<{
    testName: string;
    value: string;
    isNormal: boolean;
  }>;
  htmlContent?: string;
}

interface EmailResponse {
  success: boolean;
  error?: string;
}

export const useEmail = () => {
  const sendResults = useCallback(async (payload: EmailPayload): Promise<EmailResponse> => {
    try {
      if (!window.electron?.ipcRenderer) {
        throw new Error('Electron IPC not available');
      }

      const result = await window.electron.ipcRenderer.invoke('email:sendResults', payload);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  const sendPaymentConfirmation = useCallback(
    async (patientEmail: string, patientName: string, invoiceNumber: string, amount: number): Promise<EmailResponse> => {
      try {
        if (!window.electron?.ipcRenderer) {
          throw new Error('Electron IPC not available');
        }

        const result = await window.electron.ipcRenderer.invoke(
          'email:sendPaymentConfirmation',
          patientEmail,
          patientName,
          invoiceNumber,
          amount
        );
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const testConnection = useCallback(async (): Promise<EmailResponse> => {
    try {
      if (!window.electron?.ipcRenderer) {
        throw new Error('Electron IPC not available');
      }

      const result = await window.electron.ipcRenderer.invoke('email:testConnection');
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    sendResults,
    sendPaymentConfirmation,
    testConnection,
  };
};

export default useEmail;
