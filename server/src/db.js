import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../data.sqlite');

export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL REFERENCES conversations(id),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export function ensureConversation(id) {
  db.prepare('INSERT OR IGNORE INTO conversations (id) VALUES (?)').run(id);
}

export function appendMessage(conversationId, role, content) {
  ensureConversation(conversationId);
  db.prepare(
    'INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)'
  ).run(conversationId, role, content);
}

export function getMessages(conversationId) {
  return db
    .prepare('SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id ASC')
    .all(conversationId);
}
