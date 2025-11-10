import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'RobotComLab',
    // icon: join(__dirname, '../../public/icon.png'), // Icon path needs to be adjusted
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('db:query', async (event, { model, method, args }) => {
  try {
    const result = await prisma[model][method](...args);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('print:invoice', async (event, invoiceData) => {
  // Implement printing logic
  console.log('Printing invoice:', invoiceData);
  return { success: true };
});

ipcMain.handle('license:validate', async (event, licenseKey) => {
  // Implement license validation
  console.log('Validating license:', licenseKey);
  return { success: true, valid: true };
});

ipcMain.handle('app:get-hostname', () => {
  return require('os').hostname();
});
