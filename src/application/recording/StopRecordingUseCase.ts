import { AudioCaptureService } from '@domain/recording/AudioCaptureService';
import { RecordingRepository } from '@domain/recording/RecordingRepository';
import fs from 'fs';

export class StopRecordingUseCase {
  constructor(
    private audioCaptureService: AudioCaptureService,
    private recordingRepository: RecordingRepository
  ) {}

  async execute(recordingId: string): Promise<void> {
    if (!this.audioCaptureService.isRecording()) {
      throw new Error('No recording in progress');
    }

    // Stop audio capture
    const audioFilePath = await this.audioCaptureService.stop();

    // Get recording from repository
    const recording = await this.recordingRepository.findById({ value: recordingId });
    if (!recording) {
      throw new Error(`Recording not found: ${recordingId}`);
    }

    // Update recording with completion data
    recording.complete(new Date());

    // Update file size
    if (fs.existsSync(audioFilePath)) {
      const stats = fs.statSync(audioFilePath);
      // Note: This requires extending the entity to update metadata
      // For now, this is conceptual
    }

    // Save updated recording
    await this.recordingRepository.save(recording);
  }
}
