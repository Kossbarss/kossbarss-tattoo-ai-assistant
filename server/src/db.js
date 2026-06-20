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

  CREATE TABLE IF NOT EXISTS users (
    token TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    phone TEXT,
    name TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    claimed INTEGER NOT NULL DEFAULT 0,
    claimed_at TEXT,
    user_level TEXT,
    selected_style TEXT,
    weekly_practice_time TEXT,
    goal TEXT,
    thirty_day_plan_progress INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_active_at TEXT
  );

  CREATE TABLE IF NOT EXISTS events_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT NOT NULL REFERENCES users(token),
    event_type TEXT NOT NULL,
    value TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const messageColumns = db.prepare('PRAGMA table_info(messages)').all();
if (!messageColumns.some((col) => col.name === 'image')) {
  db.exec('ALTER TABLE messages ADD COLUMN image TEXT');
}

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

export function createUser({ token, email, phone = null }) {
  db.prepare(
    'INSERT INTO users (token, email, phone) VALUES (?, ?, ?)'
  ).run(token, email, phone);
}

export function getUserByToken(token) {
  return db.prepare('SELECT * FROM users WHERE token = ?').get(token);
}

export function updateUserProfile(token, fields) {
  const allowed = [
    'name',
    'user_level',
    'selected_style',
    'weekly_practice_time',
    'goal',
    'thirty_day_plan_progress',
  ];
  const updates = Object.keys(fields).filter((key) => allowed.includes(key));
  if (updates.length === 0) return;

  const setClause = updates.map((key) => `${key} = ?`).join(', ');
  const values = updates.map((key) => fields[key]);
  db.prepare(`UPDATE users SET ${setClause} WHERE token = ?`).run(...values, token);
}

export function touchUserLastActive(token) {
  db.prepare("UPDATE users SET last_active_at = datetime('now') WHERE token = ?").run(token);
}

export function logEvent(token, eventType, value = null) {
  db.prepare(
    'INSERT INTO events_log (token, event_type, value) VALUES (?, ?, ?)'
  ).run(token, eventType, value);
}
