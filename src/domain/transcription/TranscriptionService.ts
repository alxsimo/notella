import { TranscriptSegment } from './Transcript';

export interface TranscriptionResult {
  text: string;
  segments: TranscriptSegment[];
  language?: string;
}

export interface TranscriptionService {
  transcribe(audioFilePath: string): Promise<TranscriptionResult>;
  supportsStreaming(): boolean;
}
