export interface TranscriptId {
  value: string;
}

export interface TranscriptSegment {
  start: number; // seconds
  end: number; // seconds
  text: string;
  confidence?: number;
}

export interface Transcript {
  id: TranscriptId;
  recordingId: string;
  text: string;
  segments: TranscriptSegment[];
  createdAt: Date;
  provider: string;
  language?: string;
}

export class TranscriptEntity {
  private constructor(private readonly props: Transcript) {}

  static create(params: {
    recordingId: string;
    text: string;
    segments: TranscriptSegment[];
    provider: string;
    language?: string;
  }): TranscriptEntity {
    return new TranscriptEntity({
      id: { value: crypto.randomUUID() },
      recordingId: params.recordingId,
      text: params.text,
      segments: params.segments,
      createdAt: new Date(),
      provider: params.provider,
      language: params.language,
    });
  }

  static fromPersistence(props: Transcript): TranscriptEntity {
    return new TranscriptEntity(props);
  }

  get id(): TranscriptId {
    return this.props.id;
  }

  get text(): string {
    return this.props.text;
  }

  get segments(): TranscriptSegment[] {
    return [...this.props.segments];
  }

  toDTO(): Transcript {
    return { ...this.props };
  }
}
