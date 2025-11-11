import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { autoUpdater } from 'electron-updater';

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
    icon: join(__dirname, '../../resources/icon.png'),
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

  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://updates.robotcomlab.com' // Dummy URL
  });
  autoUpdater.checkForUpdatesAndNotify();

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
  // This is a placeholder. A real implementation would generate the PDF here.
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

ipcMain.handle('dialog:openFile', async () => {
  const { dialog } = require('electron');
  if (!mainWindow) return;
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg'] }]
  });
  if (canceled) {
    return null;
  } else {
    // Read the file and return it as a base64 data URL
    const data = require('fs').readFileSync(filePaths[0]).toString('base64');
    const mimeType = require('path').extname(filePaths[0]).substring(1);
    return `data:image/${mimeType};base64,${data}`;
  }
});

ipcMain.handle('print:pdf', async (event, pdfData) => {
  if (!mainWindow) return;
  const win = new BrowserWindow({ show: false });
  const tempPath = require('path').join(require('os').tmpdir(), `print-${Date.now()}.pdf`);
  require('fs').writeFileSync(tempPath, Buffer.from(pdfData));
  win.loadURL(`file://${tempPath}`);

  win.webContents.on('did-finish-load', () => {
    win.webContents.print({ silent: false, printBackground: true }, (success, errorType) => {
      if (!success) console.log(errorType);
      win.close();
      require('fs').unlinkSync(tempPath);
    });
  });
});
