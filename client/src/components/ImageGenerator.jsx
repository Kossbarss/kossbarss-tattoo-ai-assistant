import { useState } from 'react';

export default function ImageGenerator({ conversationId, onImageSaved }) {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generate() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, conversationId }),
      });
      const data = await res.json();
      if (data.image) {
        setImage(data.image);
        onImageSaved?.();
      } else {
        setError(data.error || 'No image returned');
      }
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="generator">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the tattoo idea (style, theme, placement)..."
        rows={3}
      />
      <button onClick={generate} disabled={loading}>
        {loading ? <span className="spinner" /> : 'Generate'}
      </button>
      {error && <p className="error">{error}</p>}
      {image && (
        <div className="result">
          <img src={image} alt="Generated tattoo idea" className="result-image" />
          <a href={image} download="tattoo-idea.png" className="download-link">
            Download
          </a>
        </div>
      )}
    </div>
  );
}
