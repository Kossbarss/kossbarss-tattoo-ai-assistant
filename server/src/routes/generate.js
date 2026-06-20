import express from 'express';
import { appendMessage } from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { prompt, size = '1024x1024', conversationId } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const tattooPrompt = `Black and white tattoo design, clean line art, white background: ${prompt}`;

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: tattooPrompt,
        size,
        n: 1,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('image API error', errBody);
      return res.status(502).json({ error: 'Failed to generate image' });
    }

    const data = await response.json();
    const imageBase64 = data.data?.[0]?.b64_json;
    const image = imageBase64 ? `data:image/png;base64,${imageBase64}` : null;

    if (image && conversationId) {
      appendMessage(conversationId, 'assistant', prompt, image);
    }

    res.json({ image });
  } catch (err) {
    console.error('generate error', err);
    res.status(502).json({ error: 'Failed to generate image' });
  }
});

export default router;
