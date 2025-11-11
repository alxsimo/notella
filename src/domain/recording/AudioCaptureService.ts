export interface AudioCaptureConfig {
  sampleRate: number;
  channels: number;
  format: string;
  outputPath: string;
}

export interface AudioCaptureService {
  start(config: AudioCaptureConfig): Promise<void>;
  stop(): Promise<string>; // returns file path
  isRecording(): boolean;
}
