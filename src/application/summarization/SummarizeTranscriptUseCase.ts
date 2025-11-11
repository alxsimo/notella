import { SummarizationService } from '@domain/summarization/SummarizationService';
import { SummaryEntity } from '@domain/summarization/Summary';
import { RecordingRepository } from '@domain/recording/RecordingRepository';

export interface TranscriptRepository {
  findById(id: { value: string }): Promise<any | null>;
}

export interface SummaryRepository {
  save(summary: SummaryEntity): Promise<void>;
}

export class SummarizeTranscriptUseCase {
  constructor(
    private summarizationService: SummarizationService,
    private transcriptRepository: TranscriptRepository,
    private summaryRepository: SummaryRepository,
    private recordingRepository: RecordingRepository
  ) {}

  async execute(transcriptId: string): Promise<string> {
    // Get transcript
    const transcript = await this.transcriptRepository.findById({ value: transcriptId });
    if (!transcript) {
      throw new Error(`Transcript not found: ${transcriptId}`);
    }

    // Summarize
    const result = await this.summarizationService.summarize(transcript.text);

    // Create summary entity
    const summary = SummaryEntity.create({
      transcriptId,
      recordingId: transcript.recordingId,
      summary: result.summary,
      actionItems: result.actionItems,
      keyPoints: result.keyPoints,
      provider: 'openai',
    });

    // Save summary
    await this.summaryRepository.save(summary);

    // Update recording
    const recording = await this.recordingRepository.findById({
      value: transcript.recordingId,
    });
    if (recording) {
      recording.attachSummary(summary.id.value);
      recording.complete(new Date()); // Mark as fully completed
      await this.recordingRepository.save(recording);
    }

    return summary.id.value;
  }
}
