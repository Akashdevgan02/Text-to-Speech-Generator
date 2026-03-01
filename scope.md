# Text-to-Speech Generator – Scope

## Table of contents

1. [Project overview](#1-project-overview)
2. [Tech stack](#2-tech-stack)
3. [Core features (in scope)](#3-core-features-in-scope)
4. [Out of scope](#4-out-of-scope)
5. [API design](#5-api-design)
6. [Frontend](#6-frontend)
7. [Configuration and deployment](#7-configuration-and-deployment)
8. [Success criteria](#8-success-criteria)

---

## 1. Project overview

- **Name**: Text-to-Speech Generator
- **One-liner**: Users paste text, choose an AI voice, and download natural-sounding MP3 via OpenAI's TTS API.
- **Audience**: Learning project for backend API integration (OpenAI TTS, Express, simple React).

---

## 2. Tech stack

- **Backend**: Node.js, Express, OpenAI TTS API.
- **Frontend**: React (simple UI; no requirement for a specific meta-framework).
- **No database**: All state is in-memory or derived from the current request; no user accounts or persistence.
- **Deployment**: Railway (single service that serves API + static React build).

---

## 3. Core features (in scope)

- **Text input**: User can paste or type text into a text area. Max length: 4096 characters per request (aligns with OpenAI limits and keeps cost predictable).
- **Voice selection**: User can choose from the available OpenAI TTS voices (alloy, echo, fable, onyx, nova, shimmer) in a dropdown or list.
- **Generate audio**: A "Generate" (or similar) action sends the text and selected voice to the backend; backend calls OpenAI TTS and returns audio. Use OpenAI model `tts-1` or `tts-1-hd` for quality (document the choice in implementation).
- **Download MP3**: User can download the generated audio as a high-quality MP3 file (OpenAI returns audio; stream or serve with `Content-Type: audio/mpeg`).
- **Error handling**: Clear feedback for API errors, invalid input, or rate limits (messages in UI; no complex retry logic required).

---

## 4. Out of scope

- **No database**: No user accounts, no history of generations, no stored transcripts.
- **No auth**: No login/signup; app is open for demo/learning.
- **No advanced features**: No SSML, no speed/pitch controls, no background jobs or queue—keep it request/response only.
- **No other TTS providers**: Only OpenAI TTS for this scope.

---

## 5. API design

- **Backend** exposes one endpoint, e.g. `POST /api/tts` (or `/api/generate`), that accepts:
  - `text` (string, required, max 4096 characters)
  - `voice` (string, one of the allowed OpenAI voice IDs)
- **Response**: Stream or return the audio file with `Content-Type: audio/mpeg` so the frontend can play or trigger download.
- No other REST endpoints for users, history, or settings—only what's needed for one-shot TTS.

---

## 6. Frontend

- One main screen: text area, voice selector, "Generate" button, and a way to play/download the result (e.g. audio player + "Download MP3").
- No routing required; optional "About" or "How it works" can be a simple inline section.
- Frontend calls the backend URL (same origin when served by Express, or configurable API URL for Railway).

---

## 7. Configuration and deployment

- **OpenAI API key**: Stored as an environment variable on the backend (e.g. `OPENAI_API_KEY`); never exposed to the frontend.
- **Railway**: Single Railway service that serves the Node/Express API and the static React build. Set `OPENAI_API_KEY` in the Railway dashboard.
- **No DB or Redis**: No additional Railway add-ons for data stores.
- **Optional**: Simple in-memory rate limit per IP for learning (not required for minimal scope).

---

## 8. Success criteria

- User can input text, select a voice, and get an MP3 download (or play in browser) from OpenAI TTS.
- Backend uses OpenAI TTS API correctly and returns/streams audio.
- App runs locally and deploys to Railway with one env var (OpenAI key).
- This scope document is the single source of truth for what's in/out of scope for this learning project.
