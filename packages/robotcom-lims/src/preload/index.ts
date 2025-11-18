import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  dbQuery: (model: string, method: string, ...args: any[]) =>
    ipcRenderer.invoke('db:query', model, method, ...args),

  db: {
    reset: () => ipcRenderer.invoke('db:reset'),
  },

  // Order operations
  createOrder: (orderData: any) =>
    ipcRenderer.invoke('order:create', orderData),

  // Printing
  printInvoice: (invoiceData: any) =>
    ipcRenderer.invoke('print:invoice', invoiceData),

  printTestResults: (resultsData: any) =>
    ipcRenderer.invoke('print:results', resultsData),

  // License management
  validateLicense: (licenseKey: string) =>
    ipcRenderer.invoke('license:validate', licenseKey),

  activateLicense: (licenseKey: string) =>
    ipcRenderer.invoke('license:activate', licenseKey),

  // File operations
  selectFile: () =>
    ipcRenderer.invoke('file:select'),

  saveFile: (data: any, filename: string) =>
    ipcRenderer.invoke('file:save', data, filename),

  // App info
  getAppVersion: () =>
    ipcRenderer.invoke('app:version'),

  checkForUpdates: () =>
    ipcRenderer.invoke('app:check-updates'),

  getHostname: () => ipcRenderer.invoke('app:get-hostname'),

  getMachineId: () => ipcRenderer.invoke('app:get-machine-id'),

  printPDF: (data: ArrayBuffer) => ipcRenderer.invoke('print:pdf', data),

  openFile: () => ipcRenderer.invoke('dialog:openFile'),
});
