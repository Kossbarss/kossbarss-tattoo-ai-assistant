import { useEffect, useState } from 'react';

export default function ConversationList({ activeId, onSelect, onNew, refreshKey }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetch('/api/chat')
      .then((res) => res.json())
      .then((data) => setConversations(data.conversations || []))
      .catch(() => {});
  }, [refreshKey]);

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm('Delete this conversation?')) return;
    await fetch(`/api/chat/${id}`, { method: 'DELETE' });
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (id === activeId) onNew();
  }

  return (
    <aside className="conversation-list">
      <button className="new-chat" onClick={onNew}>
        + New chat
      </button>
      {conversations.map((c) => (
        <div
          key={c.id}
          className={`conversation-item ${c.id === activeId ? 'active' : ''}`}
          onClick={() => onSelect(c.id)}
        >
          <span className="conversation-title">{c.title || c.lastMessage || 'New chat'}</span>
          <button className="delete-btn" onClick={(e) => handleDelete(c.id, e)} aria-label="Delete conversation">
            ×
          </button>
        </div>
      ))}
    </aside>
  );
}
