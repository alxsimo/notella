export interface SyncResult {
  success: boolean;
  remoteId?: string;
  error?: string;
}

export interface SyncService {
  uploadFile(localPath: string, remotePath: string): Promise<SyncResult>;
  isConfigured(): boolean;
}
