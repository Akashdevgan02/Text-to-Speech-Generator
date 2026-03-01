# Text-to-Speech Generator – MVP

## MVP goal

**User can paste text and download beautiful AI-generated audio in under 30 seconds.**

Backend-focused: the magic is one API call—your server talks to OpenAI TTS and streams back audio. No databases, no auth, no extra features. Just Node.js + Express + OpenAI TTS.

---

## What we're building (MVP only)

### Backend (the core)

- **One route**: `POST /api/tts`
  - **Body**: `{ "text": "Your text here" }`
  - **Optional**: `voice` (string). If omitted, use a single default voice (e.g. `nova` or `alloy`) so the first version has zero choices and still sounds great.
- **Flow**: Validate text (e.g. non-empty, max 4096 chars) → call OpenAI TTS API with that text (and default or provided voice) → return the audio binary with `Content-Type: audio/mpeg` so the browser can play or download.
- **Model**: Use `tts-1` for MVP (faster, cheaper). Upgrade to `tts-1-hd` later if you want higher quality.
- **Config**: One env var, `OPENAI_API_KEY`, read at startup. No DB, no Redis.

That’s it. One endpoint, one external call, one response. The “magical” part is: request in → audio out.

### Frontend (minimal)

- **One screen**: Text area + “Generate” button.
- **Flow**: User pastes or types text → clicks “Generate” → frontend shows a short loading state (e.g. “Generating…”) → backend returns audio → user gets a **Download** link/button (or auto-download) and optionally an inline **audio player** to hear it immediately.
- **No voice selector in MVP** (use backend default). Add voice dropdown in a later iteration.
- **Errors**: If the request fails, show a simple message (e.g. “Something went wrong. Check your text and try again.”). No retry logic required.

### Under 30 seconds

- Keep the path short: no extra hops, no DB, no heavy processing. Validate → OpenAI → stream/return. For typical paragraph-length text, the bottleneck is OpenAI; `tts-1` keeps latency low.
- Frontend: clear loading state so the user knows something is happening; as soon as the response arrives, enable play/download so they get the file in under 30 seconds from paste to download.

---

## What we're not doing in MVP

- Voice selection (fixed default voice only).
- Playback controls (speed, pitch, etc.).
- History, accounts, or persistence.
- SSML or other advanced TTS options.
- Rate limiting (optional later).

---

## MVP success criteria

1. User pastes text, clicks “Generate,” and can **download** an MP3 (and optionally **play** it in the page) within **30 seconds**.
2. Backend: single `POST /api/tts` implemented with Node.js + Express, calling OpenAI TTS and returning audio.
3. Runs locally with `OPENAI_API_KEY` set; no database or other services.
4. Feels “magical”: minimal UI, maximum impact—paste text, get beautiful AI audio.

---

## After MVP (later iterations)

- Add voice dropdown (alloy, echo, fable, onyx, nova, shimmer).
- Switch to `tts-1-hd` and/or add optional quality toggle.
- Deploy to Railway with the same single env var.
- Optional: in-memory rate limit per IP for learning.
