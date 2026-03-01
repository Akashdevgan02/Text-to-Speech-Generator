import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const isProd = process.env.NODE_ENV === 'production';

if (isProd && !OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is required in production.');
  process.exit(1);
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;

const ALLOWED_VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
const DEFAULT_VOICE = 'nova';
const MAX_TEXT_LENGTH = 4096;
const TTS_MODEL = 'tts-1-hd';

const app = express();

app.use(cors({
  origin: isProd ? undefined : ['http://localhost:5173', 'http://127.0.0.1:5173'],
}));
app.use(express.json());

// API route must be before static so /api/* is handled here
app.post('/api/tts', async (req, res) => {
  if (!openai) {
    return res.status(503).json({ error: 'TTS is not configured. Set OPENAI_API_KEY.' });
  }

  const rawText = req.body?.text;
  const text = typeof rawText === 'string' ? rawText.trim() : '';
  const voice = ALLOWED_VOICES.includes(req.body?.voice) ? req.body.voice : DEFAULT_VOICE;

  if (!text) {
    return res.status(400).json({ error: 'Text is required and cannot be empty.' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: `Text must be at most ${MAX_TEXT_LENGTH} characters.` });
  }

  try {
    const response = await openai.audio.speech.create({
      model: TTS_MODEL,
      voice,
      input: text,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="speech.mp3"');
    res.send(buffer);
  } catch (err) {
    const message = err?.message || String(err);
    console.error('OpenAI TTS error:', message);
    const status = err?.status === 429 ? 429 : (err?.status >= 400 ? err.status : 502);
    const safeMessage = err?.status === 429
      ? 'Rate limit exceeded. Try again in a moment.'
      : (message && message.length < 200 ? message : 'Something went wrong. Try again.');
    res.status(status).json({ error: safeMessage });
  }
});

// Optional health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Static and SPA fallback (production only)
if (isProd) {
  const clientDist = path.join(__dirname, 'client', 'dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) res.status(404).send('Not found');
    });
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (!openai) {
    console.warn('OPENAI_API_KEY not set; /api/tts will return 503.');
    console.warn('Create a .env file in the project root with: OPENAI_API_KEY=sk-your-key');
  } else {
    console.log('OPENAI_API_KEY loaded.');
  }
});
