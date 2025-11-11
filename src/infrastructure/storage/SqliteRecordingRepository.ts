import { RecordingRepository } from '@domain/recording/RecordingRepository';
import { RecordingEntity, RecordingId, Recording } from '@domain/recording/Recording';
import { SqliteDatabase } from './SqliteDatabase';
import Database from 'better-sqlite3';

export class SqliteRecordingRepository implements RecordingRepository {
  private db: Database.Database;

  constructor(database: SqliteDatabase) {
    this.db = database.getDatabase();
  }

  async save(recording: RecordingEntity): Promise<void> {
    const dto = recording.toDTO();

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO recordings (
        id, title, started_at, ended_at, duration, status, audio_file_path,
        transcript_id, summary_id, file_size, format, sample_rate, channels
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      dto.id.value,
      dto.title,
      dto.startedAt.getTime(),
      dto.endedAt?.getTime() || null,
      dto.duration,
      dto.status,
      dto.audioFilePath,
      dto.transcriptId || null,
      dto.summaryId || null,
      dto.metadata.fileSize,
      dto.metadata.format,
      dto.metadata.sampleRate,
      dto.metadata.channels
    );
  }

  async findById(id: RecordingId): Promise<RecordingEntity | null> {
    const stmt = this.db.prepare('SELECT * FROM recordings WHERE id = ?');
    const row = stmt.get(id.value) as any;

    if (!row) {
      return null;
    }

    return RecordingEntity.fromPersistence(this.mapRowToRecording(row));
  }

  async findAll(): Promise<RecordingEntity[]> {
    const stmt = this.db.prepare('SELECT * FROM recordings ORDER BY started_at DESC');
    const rows = stmt.all() as any[];

    return rows.map(row =>
      RecordingEntity.fromPersistence(this.mapRowToRecording(row))
    );
  }

  async delete(id: RecordingId): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM recordings WHERE id = ?');
    stmt.run(id.value);
  }

  private mapRowToRecording(row: any): Recording {
    return {
      id: { value: row.id },
      title: row.title,
      startedAt: new Date(row.started_at),
      endedAt: row.ended_at ? new Date(row.ended_at) : undefined,
      duration: row.duration,
      status: row.status,
      audioFilePath: row.audio_file_path,
      transcriptId: row.transcript_id,
      summaryId: row.summary_id,
      metadata: {
        fileSize: row.file_size,
        format: row.format,
        sampleRate: row.sample_rate,
        channels: row.channels,
      },
    };
  }
}
