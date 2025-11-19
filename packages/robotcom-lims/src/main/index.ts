import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { PrismaClient } from '@prisma/client';
import { autoUpdater } from 'electron-updater';
import * as bcrypt from 'bcrypt';
import { emailService } from './services/EmailService';

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
    // Load development URL
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
    console.log('📱 Electron app loaded in development mode');
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
ipcMain.handle('db:query', async (_event, model, method, ...args) => {
  try {
    // Handle special password validation method
    if (model === 'user' && method === 'validatePassword') {
      const [username, password] = args;
      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        return { success: true, data: { isValid: false } };
      }
      const isValid = await bcrypt.compare(password, user.password);
      return { success: true, data: { isValid } };
    }

    const result = await (prisma[model as keyof typeof prisma] as any)[method](...args);
    return { success: true, data: result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
});

// Order creation handler
ipcMain.handle('order:create', async (_event, orderData) => {
  try {
    // Note: doctorId is available in orderData but not currently used - can be added for future features
    const { patientId, testIds, subtotal, discountPercentage, labId } = orderData;

    // Generate order number based on current month
    const now = new Date();
    const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getFullYear()).slice(-2)}`;
    
    // Get the count of orders for this month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const orderCount = await prisma.invoice.count({
      where: {
        labId,
        createdAt: {
          gte: monthStart,
          lt: monthEnd,
        },
      },
    });

    const orderNumber = `${monthYear}-${String(orderCount + 1).padStart(3, '0')}`;
    const discountAmount = subtotal * (discountPercentage / 100);
    const total = subtotal - discountAmount;

    // Create sample (order)
    const sample = await prisma.sample.create({
      data: {
        sampleNumber: orderNumber,
        patientId,
        collectionDate: new Date(),
        status: 'pending',
      },
    });

    // Add tests to sample
    for (const testId of testIds) {
      const test = await prisma.test.findUnique({ where: { id: testId } });
      if (test) {
        await prisma.sampleTest.create({
          data: {
            sampleId: sample.id,
            testId,
            price: test.price,
          },
        });
      }
    }

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: orderNumber,
        patientId,
        sampleId: sample.id,
        labId,
        subtotal,
        discount: discountAmount,
        total,
        status: 'pending',
        items: {
          create: testIds.map((testId: string) => {
            return {
              description: `Test ${testId}`,
              quantity: 1,
              unitPrice: 0,
              total: 0,
            };
          }),
        },
      },
      include: {
        items: true,
        sample: {
          include: {
            tests: true,
          },
        },
      },
    });

    return { success: true, data: { invoice, sample, orderNumber } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error creating order:', errorMessage);
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('print:invoice', async (_event, _invoiceData) => {
  // This is a placeholder. A real implementation would generate the PDF here.
  return { success: true };
});

ipcMain.handle('license:validate', async (_event, licenseKey) => {
  // Implement license validation
  console.log('Validating license:', licenseKey);
  return { success: true, valid: true };
});

// Database reset handler (development only)
ipcMain.handle('db:reset', async (_event) => {
  if (process.env.NODE_ENV !== 'development') {
    return { success: false, error: 'Database reset only available in development' };
  }
  
  try {
    // Read and execute the seed SQL file
    const fs = require('fs');
    const path = require('path');
    const sqlite3 = require('sqlite3').verbose();
    
    const seedSqlPath = path.join(__dirname, '../../prisma/seed.sql');
    const dbPath = path.join(__dirname, '../../prisma/dev.db');
    
    if (!fs.existsSync(seedSqlPath)) {
      return { success: false, error: 'Seed file not found' };
    }
    
    // Open database connection
    const db = new sqlite3.Database(dbPath, (err: Error | null) => {
      if (err) {
        console.error('Failed to open database:', err);
      }
    });
    
    // Read seed SQL
    const seedSQL = fs.readFileSync(seedSqlPath, 'utf-8');
    
    // Execute all SQL statements
    return new Promise((resolve) => {
      db.exec(seedSQL, (execErr: Error | null) => {
        db.close((closeErr: Error | null) => {
          if (execErr) {
            resolve({ success: false, error: execErr.message });
          } else if (closeErr) {
            resolve({ success: false, error: closeErr.message });
          } else {
            // Reload Prisma client
            prisma.$disconnect().then(() => {
              resolve({ 
                success: true, 
                message: 'Database reset successfully. Please refresh the application.' 
              });
            });
          }
        });
      });
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('app:get-hostname', () => {
  return require('os').hostname();
});

ipcMain.handle('app:get-machine-id', async () => {
  try {
    const { machineIdSync } = require('node-machine-id');
    return machineIdSync();
  } catch (error) {
    console.warn('Failed to get machine ID:', error);
    return 'fallback-machine-id';
  }
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

ipcMain.handle('print:pdf', async (_event, pdfData) => {
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

// Email handlers
ipcMain.handle('email:sendResults', async (_event, payload) => {
  try {
    const success = await emailService.sendResultsEmail(payload);
    return { success };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('email:sendPaymentConfirmation', async (_event, patientEmail, patientName, invoiceNumber, amount) => {
  try {
    const success = await emailService.sendPaymentConfirmationEmail(patientEmail, patientName, invoiceNumber, amount);
    return { success };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
});

ipcMain.handle('email:testConnection', async () => {
  try {
    const success = await emailService.testConnection();
    return { success };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { success: false, error: errorMessage };
  }
});
