import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a knowledgeable tattoo consultant and idea generator.
Help clients explore tattoo styles, placement, sizing, healing/aftercare questions,
and brainstorm concept ideas tailored to their preferences (themes, body part, style,
size, pain tolerance, budget). Ask clarifying questions when the request is vague.
Keep answers practical and concise.`;

router.post('/', async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });
    res.json({ reply: response.content[0]?.text ?? '' });
  } catch (err) {
    console.error('chat error', err);
    res.status(502).json({ error: 'Failed to reach the AI consultant' });
  }
});

export default router;
