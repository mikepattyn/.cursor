import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from './ipc.ts';

contextBridge.exposeInMainWorld('umbrella', {
  ping: () => ipcRenderer.invoke(IPC_CHANNELS.ping),
});
