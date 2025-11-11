import { SummarizationService } from '@domain/summarization/SummarizationService';
import { OpenAISummarizationService } from './OpenAISummarizationService';

export type SummarizationProvider = 'openai' | 'anthropic' | 'google';

export interface SummarizationConfig {
  provider: SummarizationProvider;
  apiKey?: string;
}

export class SummarizationServiceFactory {
  static create(config: SummarizationConfig): SummarizationService {
    switch (config.provider) {
      case 'openai':
        if (!config.apiKey) {
          throw new Error('OpenAI API key is required');
        }
        return new OpenAISummarizationService(config.apiKey);

      case 'anthropic':
      case 'google':
        throw new Error(`Provider ${config.provider} not yet implemented`);

      default:
        throw new Error(`Unknown summarization provider: ${config.provider}`);
    }
  }
}
