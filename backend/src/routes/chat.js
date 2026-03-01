import { Router } from 'express';
import rateLimit   from 'express-rate-limit';
import { chat, chatWithHistory } from '../services/geminiService.js';

const router = Router();

// 60 messages per 15 minutes per IP
const limiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             60,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { error: 'Too many requests — slow down a bit.' },
});

router.use(limiter);

/**
 * POST /api/chat
 * Single-turn — just a prompt + optional system instruction.
 *
 * Body: { prompt: string, system?: string }
 */
router.post('/', async (req, res, next) => {
  const { prompt, system } = req.body;

  if (!prompt?.trim()) {
    return next(Object.assign(new Error('prompt is required'), { status: 400 }));
  }

  try {
    const reply = await chat(prompt.trim(), system);
    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/chat/history
 * Multi-turn — send conversation history + new message, get reply + updated history.
 *
 * Body: { message: string, history?: Array, system?: string }
 */
router.post('/history', async (req, res, next) => {
  const { message, history = [], system } = req.body;

  if (!message?.trim()) {
    return next(Object.assign(new Error('message is required'), { status: 400 }));
  }

  try {
    const result = await chatWithHistory(history, message.trim(), system);
    res.json(result);  // { reply, history }
  } catch (err) {
    next(err);
  }
});

export default router;
