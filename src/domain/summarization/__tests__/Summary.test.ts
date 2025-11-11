import { SummaryEntity } from '../Summary';

describe('SummaryEntity', () => {
  describe('create', () => {
    it('should create a summary with action items', () => {
      const summary = SummaryEntity.create({
        transcriptId: 'transcript-123',
        recordingId: 'recording-123',
        summary: 'This was a productive meeting',
        actionItems: [
          {
            description: 'Complete feature X',
            priority: 'high',
            completed: false,
          },
          {
            description: 'Review pull request',
            priority: 'medium',
            completed: false,
          },
        ],
        keyPoints: ['Point 1', 'Point 2'],
        provider: 'openai',
      });

      expect(summary.actionItems).toHaveLength(2);
      expect(summary.actionItems[0].id).toBeDefined();
      expect(summary.summary).toBe('This was a productive meeting');
    });

    it('should generate unique IDs for action items', () => {
      const summary = SummaryEntity.create({
        transcriptId: 'transcript-123',
        recordingId: 'recording-123',
        summary: 'Test',
        actionItems: [
          { description: 'Task 1', priority: 'low', completed: false },
          { description: 'Task 2', priority: 'low', completed: false },
        ],
        keyPoints: [],
        provider: 'openai',
      });

      const ids = summary.actionItems.map((item) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('toggleActionItem', () => {
    it('should toggle action item completion status', () => {
      const summary = SummaryEntity.create({
        transcriptId: 'transcript-123',
        recordingId: 'recording-123',
        summary: 'Test',
        actionItems: [
          { description: 'Task 1', priority: 'low', completed: false },
        ],
        keyPoints: [],
        provider: 'openai',
      });

      const actionItemId = summary.actionItems[0].id;

      summary.toggleActionItem(actionItemId);
      expect(summary.actionItems[0].completed).toBe(true);

      summary.toggleActionItem(actionItemId);
      expect(summary.actionItems[0].completed).toBe(false);
    });

    it('should do nothing if action item not found', () => {
      const summary = SummaryEntity.create({
        transcriptId: 'transcript-123',
        recordingId: 'recording-123',
        summary: 'Test',
        actionItems: [
          { description: 'Task 1', priority: 'low', completed: false },
        ],
        keyPoints: [],
        provider: 'openai',
      });

      summary.toggleActionItem('non-existent-id');
      expect(summary.actionItems[0].completed).toBe(false);
    });
  });
});
