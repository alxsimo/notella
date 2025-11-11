import { create } from 'zustand';

interface Recording {
  id: { value: string };
  title: string;
  startedAt: string;
  endedAt?: string;
  duration: number;
  status: string;
  audioFilePath: string;
}

interface RecordingStore {
  recordings: Recording[];
  currentRecordingId: string | null;
  isRecording: boolean;
  loadRecordings: () => Promise<void>;
  startRecording: (title: string) => Promise<void>;
  stopRecording: () => Promise<void>;
}

export const useRecordingStore = create<RecordingStore>((set, get) => ({
  recordings: [],
  currentRecordingId: null,
  isRecording: false,

  loadRecordings: async () => {
    try {
      const recordings = await window.electronAPI.recording.getAll();
      set({ recordings });
    } catch (error) {
      console.error('Failed to load recordings:', error);
    }
  },

  startRecording: async (title: string) => {
    try {
      const recordingId = await window.electronAPI.recording.start(title);
      set({ currentRecordingId: recordingId, isRecording: true });
      await get().loadRecordings();
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  },

  stopRecording: async () => {
    const { currentRecordingId } = get();
    if (!currentRecordingId) {
      throw new Error('No recording in progress');
    }

    try {
      await window.electronAPI.recording.stop(currentRecordingId);
      set({ currentRecordingId: null, isRecording: false });
      await get().loadRecordings();
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  },
}));
