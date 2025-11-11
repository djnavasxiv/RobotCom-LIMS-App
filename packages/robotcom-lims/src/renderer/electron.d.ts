// electron.d.ts
export interface IElectronAPI {
  dbQuery: (model: string, method: string, ...args: any[]) => Promise<{ success: boolean; data?: any; error?: string }>;
  printInvoice: (invoiceData: any) => Promise<{ success: boolean }>;
  printTestResults: (resultsData: any) => Promise<{ success: boolean }>;
  validateLicense: (licenseKey: string) => Promise<{ success: boolean; valid?: boolean }>;
  activateLicense: (licenseKey: string) => Promise<{ success: boolean }>;
  selectFile: () => Promise<any>;
  saveFile: (data: any, filename: string) => Promise<{ success: boolean }>;
  getAppVersion: () => Promise<string>;
  checkForUpdates: () => Promise<void>;
  getHostname: () => Promise<string>;
  printPDF: (data: ArrayBuffer) => Promise<void>;
  openFile: () => Promise<string | null>;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
