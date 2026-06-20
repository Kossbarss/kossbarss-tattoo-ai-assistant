import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../data.sqlite');

export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT NOT NULL REFERENCES conversations(id),
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export function ensureConversation(id) {
  db.prepare('INSERT OR IGNORE INTO conversations (id) VALUES (?)').run(id);
}

export function appendMessage(conversationId, role, content, image = null) {
  ensureConversation(conversationId);
  db.prepare(
    'INSERT INTO messages (conversation_id, role, content, image) VALUES (?, ?, ?, ?)'
  ).run(conversationId, role, content, image);
  db.prepare(
    'UPDATE conversations SET title = COALESCE(title, ?) WHERE id = ? AND title IS NULL'
  ).run(content.slice(0, 60), conversationId);
}

export function getMessages(conversationId) {
  return db
    .prepare('SELECT role, content, image FROM messages WHERE conversation_id = ? ORDER BY id ASC')
    .all(conversationId);
}

export function listConversations() {
  return db
    .prepare(
      `SELECT c.id, c.title, c.created_at,
        (SELECT content FROM messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) AS lastMessage
       FROM conversations c
       ORDER BY c.created_at DESC`
    )
    .all();
}

export function deleteConversation(conversationId) {
  db.prepare('DELETE FROM messages WHERE conversation_id = ?').run(conversationId);
  db.prepare('DELETE FROM conversations WHERE id = ?').run(conversationId);
}
