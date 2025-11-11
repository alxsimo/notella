import {
  TranscriptionService,
  TranscriptionResult,
} from '@domain/transcription/TranscriptionService';
import OpenAI from 'openai';
import fs from 'fs';

export class OpenAIWhisperService implements TranscriptionService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async transcribe(audioFilePath: string): Promise<TranscriptionResult> {
    try {
      const audioFile = fs.createReadStream(audioFilePath);

      const response = await this.client.audio.transcriptions.create({
        file: audioFile,
        model: 'whisper-1',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
      });

      const segments = (response as any).segments?.map((seg: any) => ({
        start: seg.start,
        end: seg.end,
        text: seg.text,
      })) || [];

      return {
        text: response.text,
        segments,
        language: (response as any).language,
      };
    } catch (error) {
      throw new Error(`Transcription failed: ${error}`);
    }
  }

  supportsStreaming(): boolean {
    return false;
  }
}
