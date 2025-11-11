import { TranscriptionService } from '@domain/transcription/TranscriptionService';
import { OpenAIWhisperService } from './OpenAIWhisperService';

export type TranscriptionProvider = 'openai-whisper' | 'deepgram' | 'assemblyai';

export interface TranscriptionConfig {
  provider: TranscriptionProvider;
  apiKey?: string;
}

export class TranscriptionServiceFactory {
  static create(config: TranscriptionConfig): TranscriptionService {
    switch (config.provider) {
      case 'openai-whisper':
        if (!config.apiKey) {
          throw new Error('OpenAI API key is required');
        }
        return new OpenAIWhisperService(config.apiKey);

      case 'deepgram':
      case 'assemblyai':
        throw new Error(`Provider ${config.provider} not yet implemented`);

      default:
        throw new Error(`Unknown transcription provider: ${config.provider}`);
    }
  }
}
