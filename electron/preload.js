import { contextBridge } from 'electron';

// Expose safe, selected APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  // You can add more communication bridges using ipcRenderer.send/on here if needed
});
