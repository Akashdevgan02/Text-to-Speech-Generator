# Text-to-Speech Generator – UI Design

ASCII layout and components for the single-screen app; text input is the main focus.

---

## Wireframe

```
+------------------------------------------------------------------+
|                    Text-to-Speech Generator                       |
+------------------------------------------------------------------+
|                                                                  |
|  Enter or paste your text                                        |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |                                                            |  |
|  |                                                            |  |
|  |                                                            |  |
|  |                                                            |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|  0 / 4096 characters                                            |
|                                                                  |
|  Voice    [ nova        ▼ ]          [ Generate ]                |
|                                                                  |
|  -----------------------------------------------------------------|
|  Your audio                                                      |
|  ( Generate to hear your audio here )                            |
|                                                                  |
|  [ ▶ Play ]    [ Download MP3 ]                                  |
|  -----------------------------------------------------------------|
|                                                                  |
|  ( Loading or error message appears here )                       |
|                                                                  |
+------------------------------------------------------------------+
```

---

## Components

- **App title** – Static header; app name only.
- **Text area** – Primary input; multi-line, placeholder optional; max 4096 chars.
- **Character count** – Displays current length and limit (e.g. "0 / 4096").
- **Voice selector** – Dropdown of OpenAI voices (alloy, echo, fable, onyx, nova, shimmer). Omit in MVP (use default).
- **Generate button** – Primary action; sends text (and voice) to backend, triggers loading state.
- **Audio result section** – Container for player and download; shows placeholder until audio is ready.
- **Play control** – Inline playback (e.g. native audio element or play button).
- **Download MP3 button** – Triggers download of the generated file.
- **Status line** – Shows "Generating…" or error text; hidden when idle.

---

## Layout notes

- **Hierarchy**: Text input is largest and first; then actions; then result and feedback.
- **MVP**: Same layout; hide or simplify voice selector (single default) until post-MVP.
- **Tone**: Minimal chrome, no extra nav or tabs; one screen, beginner-friendly and professional.
