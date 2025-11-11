import { RecordingEntity, RecordingStatus } from '../Recording';

describe('RecordingEntity', () => {
  describe('create', () => {
    it('should create a new recording with RECORDING status', () => {
      const recording = RecordingEntity.create({
        title: 'Team Meeting',
        audioFilePath: '/path/to/audio.wav',
        metadata: {
          fileSize: 0,
          format: 'wav',
          sampleRate: 44100,
          channels: 2,
        },
      });

      expect(recording.isRecording).toBe(true);
      expect(recording.status).toBe(RecordingStatus.RECORDING);
    });

    it('should generate a unique ID', () => {
      const recording1 = RecordingEntity.create({
        title: 'Meeting 1',
        audioFilePath: '/path/1.wav',
        metadata: {
          fileSize: 0,
          format: 'wav',
          sampleRate: 44100,
          channels: 2,
        },
      });

      const recording2 = RecordingEntity.create({
        title: 'Meeting 2',
        audioFilePath: '/path/2.wav',
        metadata: {
          fileSize: 0,
          format: 'wav',
          sampleRate: 44100,
          channels: 2,
        },
      });

      expect(recording1.id.value).not.toBe(recording2.id.value);
    });
  });

  describe('complete', () => {
    it('should mark recording as completed and calculate duration', () => {
      const recording = RecordingEntity.create({
        title: 'Test',
        audioFilePath: '/test.wav',
        metadata: {
          fileSize: 0,
          format: 'wav',
          sampleRate: 44100,
          channels: 2,
        },
      });

      const startTime = recording.toDTO().startedAt;
      const endTime = new Date(startTime.getTime() + 60000); // 1 minute later

      recording.complete(endTime);

      expect(recording.isCompleted).toBe(true);
      expect(recording.status).toBe(RecordingStatus.COMPLETED);
      expect(recording.toDTO().duration).toBe(60);
    });
  });

  describe('markAsProcessing', () => {
    it('should change status to PROCESSING', () => {
      const recording = RecordingEntity.create({
        title: 'Test',
        audioFilePath: '/test.wav',
        metadata: {
          fileSize: 0,
          format: 'wav',
          sampleRate: 44100,
          channels: 2,
        },
      });

      recording.markAsProcessing();

      expect(recording.status).toBe(RecordingStatus.PROCESSING);
    });
  });

  describe('attachTranscript', () => {
    it('should attach transcript ID to recording', () => {
      const recording = RecordingEntity.create({
        title: 'Test',
        audioFilePath: '/test.wav',
        metadata: {
          fileSize: 0,
          format: 'wav',
          sampleRate: 44100,
          channels: 2,
        },
      });

      const transcriptId = 'transcript-123';
      recording.attachTranscript(transcriptId);

      expect(recording.toDTO().transcriptId).toBe(transcriptId);
    });
  });

  describe('attachSummary', () => {
    it('should attach summary ID to recording', () => {
      const recording = RecordingEntity.create({
        title: 'Test',
        audioFilePath: '/test.wav',
        metadata: {
          fileSize: 0,
          format: 'wav',
          sampleRate: 44100,
          channels: 2,
        },
      });

      const summaryId = 'summary-456';
      recording.attachSummary(summaryId);

      expect(recording.toDTO().summaryId).toBe(summaryId);
    });
  });
});
