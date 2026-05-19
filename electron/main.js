import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 760,
    minWidth: 380,
    minHeight: 600,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    // Beautiful framing: hide standard menu bar for a premium look
    autoHideMenuBar: true,
    titleBarStyle: 'default', // Standard OS window controls
    title: 'Timer Exercise',
    backgroundColor: '#0a0a0c', // Dark background matching the app's dark aesthetic
  });

  // Decide if we are in development mode
  const isDev = process.env.ELECTRON_DEV === 'true' || !app.isPackaged;

  if (isDev) {
    // Development: point to Vite dev server
    mainWindow.loadURL('http://localhost:5173/');
    // Open DevTools if desired
    // mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Production: load the built HTML index
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Gracefully show window only when ready to avoid flashing
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Disable hardware acceleration issues on some Linux systems if needed, but usually default is fine.
// app.disableHardwareAcceleration();

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
