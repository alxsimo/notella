import {
  SummarizationService,
  SummarizationResult,
} from '@domain/summarization/SummarizationService';
import OpenAI from 'openai';

export class OpenAISummarizationService implements SummarizationService {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async summarize(text: string): Promise<SummarizationResult> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that analyzes meeting transcripts and provides:
1. A concise summary of the main discussion points
2. A list of action items with priority levels (low, medium, high)
3. Key points from the conversation

Respond in JSON format:
{
  "summary": "string",
  "actionItems": [{"description": "string", "priority": "low|medium|high", "assignee": "string or null", "completed": false}],
  "keyPoints": ["string"]
}`,
          },
          {
            role: 'user',
            content: `Please analyze this transcript:\n\n${text}`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');

      return {
        summary: result.summary || '',
        actionItems: result.actionItems || [],
        keyPoints: result.keyPoints || [],
      };
    } catch (error) {
      throw new Error(`Summarization failed: ${error}`);
    }
  }
}
