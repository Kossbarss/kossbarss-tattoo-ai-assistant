import { useState } from 'react';
import Chat from './components/Chat.jsx';
import ImageGenerator from './components/ImageGenerator.jsx';

export default function App() {
  const [tab, setTab] = useState('chat');

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
      <main>{tab === 'chat' ? <Chat /> : <ImageGenerator />}</main>
    </div>
  );
}
