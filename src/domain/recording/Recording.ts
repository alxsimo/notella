export interface RecordingId {
  value: string;
}

export enum RecordingStatus {
  RECORDING = 'recording',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Recording {
  id: RecordingId;
  title: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number; // in seconds
  status: RecordingStatus;
  audioFilePath: string;
  transcriptId?: string;
  summaryId?: string;
  metadata: RecordingMetadata;
}

export interface RecordingMetadata {
  fileSize: number; // in bytes
  format: string;
  sampleRate: number;
  channels: number;
}

export class RecordingEntity {
  private constructor(private readonly props: Recording) {}

  static create(params: {
    title: string;
    audioFilePath: string;
    metadata: RecordingMetadata;
  }): RecordingEntity {
    return new RecordingEntity({
      id: { value: crypto.randomUUID() },
      title: params.title,
      startedAt: new Date(),
      duration: 0,
      status: RecordingStatus.RECORDING,
      audioFilePath: params.audioFilePath,
      metadata: params.metadata,
    });
  }

  static fromPersistence(props: Recording): RecordingEntity {
    return new RecordingEntity(props);
  }

  complete(endedAt: Date): void {
    this.props.endedAt = endedAt;
    this.props.duration = Math.floor(
      (endedAt.getTime() - this.props.startedAt.getTime()) / 1000
    );
    this.props.status = RecordingStatus.COMPLETED;
  }

  markAsProcessing(): void {
    this.props.status = RecordingStatus.PROCESSING;
  }

  markAsFailed(): void {
    this.props.status = RecordingStatus.FAILED;
  }

  attachTranscript(transcriptId: string): void {
    this.props.transcriptId = transcriptId;
  }

  attachSummary(summaryId: string): void {
    this.props.summaryId = summaryId;
  }

  get id(): RecordingId {
    return this.props.id;
  }

  get status(): RecordingStatus {
    return this.props.status;
  }

  get isRecording(): boolean {
    return this.props.status === RecordingStatus.RECORDING;
  }

  get isCompleted(): boolean {
    return this.props.status === RecordingStatus.COMPLETED;
  }

  toDTO(): Recording {
    return { ...this.props };
  }
}
