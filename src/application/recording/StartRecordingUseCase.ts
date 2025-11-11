import { AudioCaptureService } from '@domain/recording/AudioCaptureService';
import { RecordingRepository } from '@domain/recording/RecordingRepository';
import { RecordingEntity } from '@domain/recording/Recording';
import path from 'path';

export interface StartRecordingCommand {
  title: string;
  outputDirectory: string;
}

export class StartRecordingUseCase {
  constructor(
    private audioCaptureService: AudioCaptureService,
    private recordingRepository: RecordingRepository
  ) {}

  async execute(command: StartRecordingCommand): Promise<string> {
    if (this.audioCaptureService.isRecording()) {
      throw new Error('A recording is already in progress');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `recording-${timestamp}.wav`;
    const audioFilePath = path.join(command.outputDirectory, fileName);

    // Start audio capture
    await this.audioCaptureService.start({
      sampleRate: 44100,
      channels: 2,
      format: 'wav',
      outputPath: audioFilePath,
    });

    // Create recording entity
    const recording = RecordingEntity.create({
      title: command.title,
      audioFilePath,
      metadata: {
        fileSize: 0, // Will be updated when recording stops
        format: 'wav',
        sampleRate: 44100,
        channels: 2,
      },
    });

    // Save to repository
    await this.recordingRepository.save(recording);

    return recording.id.value;
  }
}
