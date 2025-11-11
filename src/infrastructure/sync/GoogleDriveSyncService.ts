import { SyncService, SyncResult } from '@domain/storage/SyncService';
import { drive_v3, google } from 'googleapis';
import fs from 'fs';
import path from 'path';

export interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken: string;
  folderId?: string; // Optional specific folder ID
}

export class GoogleDriveSyncService implements SyncService {
  private drive: drive_v3.Drive;
  private folderId?: string;

  constructor(config: GoogleDriveConfig) {
    const oauth2Client = new google.auth.OAuth2(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );

    oauth2Client.setCredentials({
      refresh_token: config.refreshToken,
    });

    this.drive = google.drive({ version: 'v3', auth: oauth2Client });
    this.folderId = config.folderId;
  }

  async uploadFile(localPath: string, remotePath: string): Promise<SyncResult> {
    try {
      if (!fs.existsSync(localPath)) {
        return {
          success: false,
          error: `File not found: ${localPath}`,
        };
      }

      const fileName = path.basename(remotePath);
      const fileMetadata: drive_v3.Schema$File = {
        name: fileName,
        parents: this.folderId ? [this.folderId] : undefined,
      };

      const media = {
        mimeType: this.getMimeType(localPath),
        body: fs.createReadStream(localPath),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id',
      });

      return {
        success: true,
        remoteId: response.data.id || undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: `Upload failed: ${error}`,
      };
    }
  }

  isConfigured(): boolean {
    return !!this.drive;
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.txt': 'text/plain',
      '.json': 'application/json',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
}
