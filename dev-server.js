#!/usr/bin/env node

/**
 * Headless Development Server for RobotComLab LIMS
 * 
 * This starts the Vite dev server and API server without requiring Electron or X11
 * Useful for remote development, CI/CD pipelines, and headless environments
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 RobotComLab LIMS - Headless Development Server');
console.log('================================================');
console.log('');
console.log('ℹ️  Running Vite dev server (no Electron window)');
console.log('ℹ️  Access the app at: http://localhost:5173');
console.log('');

const env = {
  ...process.env,
  NODE_ENV: 'development',
  VITE_DEV_SERVER_URL: 'http://localhost:5173/'
};

// Start Vite directly instead of through electron-vite
const vite = spawn('npx', ['vite', 'src/renderer', '--host', '--port', '5173'], {
  cwd: path.join(__dirname, 'packages/robotcom-lims'),
  env,
  stdio: 'inherit',
  shell: true
});

vite.on('error', (err) => {
  console.error('❌ Failed to start Vite dev server:', err);
  process.exit(1);
});

vite.on('exit', (code) => {
  console.log('');
  console.log('🛑 Dev server stopped');
  process.exit(code);
});

// Handle signals
process.on('SIGINT', () => {
  console.log('');
  console.log('⏹️  Stopping dev server...');
  vite.kill('SIGINT');
});

process.on('SIGTERM', () => {
  vite.kill('SIGTERM');
});
