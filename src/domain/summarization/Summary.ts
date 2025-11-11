export interface SummaryId {
  value: string;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface Summary {
  id: SummaryId;
  transcriptId: string;
  recordingId: string;
  summary: string;
  actionItems: ActionItem[];
  keyPoints: string[];
  createdAt: Date;
  provider: string;
}

export class SummaryEntity {
  private constructor(private readonly props: Summary) {}

  static create(params: {
    transcriptId: string;
    recordingId: string;
    summary: string;
    actionItems: Omit<ActionItem, 'id'>[];
    keyPoints: string[];
    provider: string;
  }): SummaryEntity {
    return new SummaryEntity({
      id: { value: crypto.randomUUID() },
      transcriptId: params.transcriptId,
      recordingId: params.recordingId,
      summary: params.summary,
      actionItems: params.actionItems.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
      })),
      keyPoints: params.keyPoints,
      createdAt: new Date(),
      provider: params.provider,
    });
  }

  static fromPersistence(props: Summary): SummaryEntity {
    return new SummaryEntity(props);
  }

  toggleActionItem(actionItemId: string): void {
    const item = this.props.actionItems.find((i) => i.id === actionItemId);
    if (item) {
      item.completed = !item.completed;
    }
  }

  get id(): SummaryId {
    return this.props.id;
  }

  get summary(): string {
    return this.props.summary;
  }

  get actionItems(): ActionItem[] {
    return [...this.props.actionItems];
  }

  toDTO(): Summary {
    return { ...this.props };
  }
}
