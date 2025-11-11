import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export class SqliteDatabase {
  private db: Database.Database;

  constructor(dbPath: string) {
    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize(): void {
    // Recordings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS recordings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        ended_at INTEGER,
        duration INTEGER NOT NULL,
        status TEXT NOT NULL,
        audio_file_path TEXT NOT NULL,
        transcript_id TEXT,
        summary_id TEXT,
        file_size INTEGER NOT NULL,
        format TEXT NOT NULL,
        sample_rate INTEGER NOT NULL,
        channels INTEGER NOT NULL
      )
    `);

    // Transcripts table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS transcripts (
        id TEXT PRIMARY KEY,
        recording_id TEXT NOT NULL,
        text TEXT NOT NULL,
        segments TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        provider TEXT NOT NULL,
        language TEXT,
        FOREIGN KEY (recording_id) REFERENCES recordings(id) ON DELETE CASCADE
      )
    `);

    // Summaries table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS summaries (
        id TEXT PRIMARY KEY,
        transcript_id TEXT NOT NULL,
        recording_id TEXT NOT NULL,
        summary TEXT NOT NULL,
        action_items TEXT NOT NULL,
        key_points TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        provider TEXT NOT NULL,
        FOREIGN KEY (transcript_id) REFERENCES transcripts(id) ON DELETE CASCADE,
        FOREIGN KEY (recording_id) REFERENCES recordings(id) ON DELETE CASCADE
      )
    `);

    // Enable foreign keys
    this.db.pragma('foreign_keys = ON');
  }

  getDatabase(): Database.Database {
    return this.db;
  }

  close(): void {
    this.db.close();
  }
}
