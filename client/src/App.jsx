import { useState, useCallback } from 'react';
import './App.css';

const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
const MAX_LENGTH = 4096;
const WARN_LENGTH = 3800;

export default function App() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('nova');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  const revokePrevious = useCallback((url) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  const handleGenerate = async () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_LENGTH) return;
    if (audioUrl) {
      revokePrevious(audioUrl);
      setAudioUrl(null);
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed, voice }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Try again.');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    } catch (err) {
      setError(err.message || 'Something went wrong. Check your text and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canGenerate) handleGenerate();
    }
  };

  const handleClear = () => {
    setText('');
    setError('');
    if (audioUrl) {
      revokePrevious(audioUrl);
      setAudioUrl(null);
    }
  };

  const canGenerate = text.trim().length > 0 && text.length <= MAX_LENGTH && !loading;
  const nearLimit = text.length >= WARN_LENGTH;

  return (
    <div className="app">
      <h1 className="title">Text-to-Speech Generator</h1>

      <label className="label" htmlFor="tts-text">Enter or paste your text</label>
      <textarea
        id="tts-text"
        className="textarea"
        value={text}
        onChange={(e) => {
          setText(e.target.value.slice(0, MAX_LENGTH));
          if (error) setError('');
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type or paste the text you want to convert to speech..."
        maxLength={MAX_LENGTH}
        rows={8}
        disabled={loading}
        aria-describedby="char-count"
      />
      <div id="char-count" className={`charCount ${nearLimit ? 'charCountWarn' : ''}`} aria-live="polite">
        {text.length} / {MAX_LENGTH} characters
      </div>
      <div className="charCountActions">
        <button type="button" className="clearBtn" onClick={handleClear} disabled={loading} aria-label="Clear text">
          Clear
        </button>
      </div>

      <div className="actions">
        <label className="voiceLabel" htmlFor="voice-select">
          Voice
        </label>
        <select
          id="voice-select"
          className="voiceSelect"
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          disabled={loading}
          aria-label="Select voice"
        >
          {VOICES.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <button
          type="button"
          className={`generateBtn ${loading ? 'generateBtnLoading' : ''}`}
          onClick={handleGenerate}
          disabled={!canGenerate}
          aria-label={loading ? 'Generating audio' : 'Generate speech'}
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </div>

      <section className="audioSection" aria-labelledby="audio-heading">
        <h2 id="audio-heading" className="audioHeading">Your audio</h2>
        {!audioUrl && !loading && (
          <p className="placeholder">Generate to hear your audio here</p>
        )}
        {loading && (
          <div className="audioSkeleton" aria-hidden="true">
            <div className="audioSkeletonBar" />
            <div className="audioSkeletonBtn" />
          </div>
        )}
        {audioUrl && (
          <div className="audioResult audioResultCard">
            <audio className="audioPlayer" controls src={audioUrl} />
            <a
              className="downloadBtn"
              href={audioUrl}
              download="speech.mp3"
              aria-label="Download MP3"
            >
              Download MP3
            </a>
          </div>
        )}
      </section>

      {error && (
        <div className="statusErrorWrap" role="alert">
          <p className="status error">{error}</p>
          <button type="button" className="dismissBtn" onClick={() => setError('')} aria-label="Dismiss error">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
