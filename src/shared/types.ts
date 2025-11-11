export interface ElectronAPI {
  recording: {
    start: (title: string) => Promise<string>;
    stop: (recordingId: string) => Promise<void>;
    getAll: () => Promise<any[]>;
    getById: (recordingId: string) => Promise<any>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
