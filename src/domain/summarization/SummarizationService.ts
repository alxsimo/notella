import { ActionItem } from './Summary';

export interface SummarizationResult {
  summary: string;
  actionItems: Omit<ActionItem, 'id'>[];
  keyPoints: string[];
}

export interface SummarizationService {
  summarize(text: string): Promise<SummarizationResult>;
}
