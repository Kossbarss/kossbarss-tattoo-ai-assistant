import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { appendMessage, getMessages, listConversations, deleteConversation } from '../db.js';

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a knowledgeable tattoo consultant and idea generator.
Help clients explore tattoo styles, placement, sizing, healing/aftercare questions,
and brainstorm concept ideas tailored to their preferences (themes, body part, style,
size, pain tolerance, budget). Ask clarifying questions when the request is vague.
Keep answers practical and concise.`;

router.get('/', (req, res) => {
  res.json({ conversations: listConversations() });
});

router.get('/:conversationId', (req, res) => {
  res.json({ messages: getMessages(req.params.conversationId) });
});

router.delete('/:conversationId', (req, res) => {
  deleteConversation(req.params.conversationId);
  res.json({ ok: true });
});

router.post('/', async (req, res) => {
  const { conversationId, message } = req.body;
  if (!conversationId || !message) {
    return res.status(400).json({ error: 'conversationId and message are required' });
  }

  appendMessage(conversationId, 'user', message);
  const history = getMessages(conversationId)
    .filter((m) => !m.image)
    .map(({ role, content }) => ({ role, content }));

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: history,
    });
    const reply = response.content[0]?.text ?? '';
    appendMessage(conversationId, 'assistant', reply);
    res.json({ reply });
  } catch (err) {
    console.error('chat error', err);
    res.status(502).json({ error: 'Failed to reach the AI consultant' });
  }
});

export default router;
