import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use ipcRenderer
contextBridge.exposeInMainWorld('electronAPI', {
  recording: {
    start: (title: string) => ipcRenderer.invoke('recording:start', title),
    stop: (recordingId: string) => ipcRenderer.invoke('recording:stop', recordingId),
    getAll: () => ipcRenderer.invoke('recording:getAll'),
    getById: (recordingId: string) => ipcRenderer.invoke('recording:getById', recordingId),
  },
});
