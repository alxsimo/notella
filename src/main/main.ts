import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { SqliteDatabase } from '../infrastructure/storage/SqliteDatabase';
import { SqliteRecordingRepository } from '../infrastructure/storage/SqliteRecordingRepository';
import { NodeAudioCaptureService } from '../infrastructure/recording/NodeAudioCaptureService';
import { StartRecordingUseCase } from '../application/recording/StartRecordingUseCase';
import { StopRecordingUseCase } from '../application/recording/StopRecordingUseCase';

let mainWindow: BrowserWindow | null = null;
let database: SqliteDatabase;
let recordingRepository: SqliteRecordingRepository;
let audioCaptureService: NodeAudioCaptureService;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function initializeServices(): void {
  const dbPath = path.join(app.getPath('userData'), 'notella.db');
  database = new SqliteDatabase(dbPath);
  recordingRepository = new SqliteRecordingRepository(database);
  audioCaptureService = new NodeAudioCaptureService();
}

function setupIpcHandlers(): void {
  // Start recording
  ipcMain.handle('recording:start', async (_, title: string) => {
    const useCase = new StartRecordingUseCase(
      audioCaptureService,
      recordingRepository
    );
    const recordingId = await useCase.execute({
      title,
      outputDirectory: path.join(app.getPath('userData'), 'recordings'),
    });
    return recordingId;
  });

  // Stop recording
  ipcMain.handle('recording:stop', async (_, recordingId: string) => {
    const useCase = new StopRecordingUseCase(
      audioCaptureService,
      recordingRepository
    );
    await useCase.execute(recordingId);
  });

  // Get all recordings
  ipcMain.handle('recording:getAll', async () => {
    const recordings = await recordingRepository.findAll();
    return recordings.map((r) => r.toDTO());
  });

  // Get recording by ID
  ipcMain.handle('recording:getById', async (_, recordingId: string) => {
    const recording = await recordingRepository.findById({ value: recordingId });
    return recording?.toDTO();
  });
}

app.whenReady().then(() => {
  initializeServices();
  setupIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    database?.close();
    app.quit();
  }
});

app.on('will-quit', () => {
  database?.close();
});
