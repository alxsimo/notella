import { Recording, RecordingEntity, RecordingId } from './Recording';

export interface RecordingRepository {
  save(recording: RecordingEntity): Promise<void>;
  findById(id: RecordingId): Promise<RecordingEntity | null>;
  findAll(): Promise<RecordingEntity[]>;
  delete(id: RecordingId): Promise<void>;
}
