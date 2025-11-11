import { TranscriptionService } from '@domain/transcription/TranscriptionService';
import { RecordingRepository } from '@domain/recording/RecordingRepository';
import { TranscriptEntity } from '@domain/transcription/Transcript';
import { SyncService } from '@domain/storage/SyncService';

export interface TranscriptRepository {
  save(transcript: TranscriptEntity): Promise<void>;
}

export class TranscribeRecordingUseCase {
  constructor(
    private transcriptionService: TranscriptionService,
    private recordingRepository: RecordingRepository,
    private transcriptRepository: TranscriptRepository,
    private syncService?: SyncService
  ) {}

  async execute(recordingId: string): Promise<string> {
    // Get recording
    const recording = await this.recordingRepository.findById({ value: recordingId });
    if (!recording) {
      throw new Error(`Recording not found: ${recordingId}`);
    }

    // Mark as processing
    recording.markAsProcessing();
    await this.recordingRepository.save(recording);

    try {
      // Transcribe audio
      const result = await this.transcriptionService.transcribe(
        recording.toDTO().audioFilePath
      );

      // Create transcript entity
      const transcript = TranscriptEntity.create({
        recordingId,
        text: result.text,
        segments: result.segments,
        provider: 'openai-whisper',
        language: result.language,
      });

      // Save transcript
      await this.transcriptRepository.save(transcript);

      // Attach to recording
      recording.attachTranscript(transcript.id.value);
      recording.markAsProcessing(); // Still processing (summary pending)
      await this.recordingRepository.save(recording);

      // Sync transcript to Google Drive if configured
      if (this.syncService?.isConfigured()) {
        const transcriptPath = `${recordingId}-transcript.txt`;
        await this.syncService.uploadFile(
          recording.toDTO().audioFilePath,
          transcriptPath
        );
      }

      return transcript.id.value;
    } catch (error) {
      recording.markAsFailed();
      await this.recordingRepository.save(recording);
      throw error;
    }
  }
}
