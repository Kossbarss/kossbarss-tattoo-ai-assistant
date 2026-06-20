import { useState } from 'react';
import Chat from './components/Chat.jsx';
import ImageGenerator from './components/ImageGenerator.jsx';
import ConversationList from './components/ConversationList.jsx';

function getStoredConversationId() {
  let id = localStorage.getItem('tattoo-ai-conversation-id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('tattoo-ai-conversation-id', id);
  }
  return id;
}

export default function App() {
  const [tab, setTab] = useState('chat');
  const [conversationId, setConversationId] = useState(getStoredConversationId);
  const [refreshKey, setRefreshKey] = useState(0);

  function selectConversation(id) {
    localStorage.setItem('tattoo-ai-conversation-id', id);
    setConversationId(id);
  }

  function newConversation() {
    const id = crypto.randomUUID();
    localStorage.setItem('tattoo-ai-conversation-id', id);
    setConversationId(id);
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="app">
      <header>
        <h1>Tattoo AI Assistant</h1>
        <nav>
          <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>
            Consultant
          </button>
          <button className={tab === 'generate' ? 'active' : ''} onClick={() => setTab('generate')}>
            Idea Generator
          </button>
        </nav>
      </header>
      <div className="layout">
        <ConversationList
          activeId={conversationId}
          onSelect={selectConversation}
          onNew={newConversation}
          refreshKey={refreshKey}
        />
        <main>
          {tab === 'chat' ? (
            <Chat conversationId={conversationId} onMessageSent={() => setRefreshKey((k) => k + 1)} />
          ) : (
            <ImageGenerator conversationId={conversationId} onImageSaved={() => setRefreshKey((k) => k + 1)} />
          )}
        </main>
      </div>
    </div>
  );
}
