import { useEffect, useState } from 'react';

export default function Chat({ conversationId, onMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/chat/${conversationId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []))
      .catch(() => {});
  }, [conversationId]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || data.error }]);
      onMessageSent?.();
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat">
      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.image ? <img src={m.image} alt="Generated tattoo idea" className="result-image" /> : m.content}
          </div>
        ))}
        {loading && (
          <div className="bubble assistant">
            <span className="spinner" />
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about styles, placement, aftercare, or brainstorm an idea..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}
