import {
  AudioCaptureService,
  AudioCaptureConfig,
} from '@domain/recording/AudioCaptureService';

/**
 * Audio capture service using node-audio-recorder with BlackHole virtual audio driver
 *
 * Prerequisites:
 * - BlackHole virtual audio driver installed on macOS
 * - Audio MIDI Setup configured to capture system audio
 */
export class NodeAudioCaptureService implements AudioCaptureService {
  private recording = false;
  private currentFilePath?: string;
  // In actual implementation, this would use node-audio-recorder or similar
  private recorder: any = null;

  async start(config: AudioCaptureConfig): Promise<void> {
    if (this.recording) {
      throw new Error('Already recording');
    }

    this.currentFilePath = config.outputPath;
    this.recording = true;

    // TODO: Initialize node-audio-recorder with BlackHole input
    // const AudioRecorder = require('node-audio-recorder');
    // this.recorder = new AudioRecorder({
    //   program: 'sox',
    //   device: 'BlackHole 2ch', // Configure based on system
    //   bits: 16,
    //   channels: config.channels,
    //   encoding: 'signed-integer',
    //   rate: config.sampleRate,
    //   type: config.format,
    // }, console);
    //
    // const file = fs.createWriteStream(config.outputPath, { encoding: 'binary' });
    // this.recorder.stream().pipe(file);
    // this.recorder.start();

    console.log(`Started recording to ${config.outputPath}`);
  }

  async stop(): Promise<string> {
    if (!this.recording || !this.currentFilePath) {
      throw new Error('Not currently recording');
    }

    // TODO: Stop the recorder
    // this.recorder.stop();

    const filePath = this.currentFilePath;
    this.recording = false;
    this.currentFilePath = undefined;

    console.log(`Stopped recording: ${filePath}`);
    return filePath;
  }

  isRecording(): boolean {
    return this.recording;
  }
}
