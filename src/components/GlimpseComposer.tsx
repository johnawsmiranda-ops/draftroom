"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createGlimpseAction } from "@/lib/actions/glimpses";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;
  start: () => void;
  stop: () => void;
  abort?: () => void;
  onresult: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: unknown) => void) | null;
  onstart?: (() => void) | null;
};

// Human-readable explanations for the SpeechRecognition error codes people
// actually hit. Without these the mic just silently does nothing, which is
// indistinguishable from the feature being broken.
const SPEECH_ERRORS: Record<string, string> = {
  "not-allowed":
    "Microphone access was blocked. Allow the mic for this site in your browser settings, then try again.",
  "service-not-allowed":
    "Your browser blocked speech recognition. On Android, check that Google app permissions allow the microphone.",
  network:
    "Speech recognition needs an internet connection and couldn't reach the service. Check your connection and try again.",
  "audio-capture": "No microphone was found. Check that one is connected and not in use by another app.",
  aborted: "Voice capture stopped unexpectedly. Tap to start again.",
  "no-speech": "Didn't catch anything — tap to start again and speak a little louder.",
};

const PROMPTS = ["Quick note", "Dialogue", "Scene", "Question"];

// Say any of these at the end of a voice glimpse to stop listening, save it,
// and pin it automatically — a hands-free way to close out a thought. Listed
// longest-first so a shorter phrase that's a substring of a longer one (e.g.
// "glimpse save" inside "save glimpse") doesn't match before the fuller one.
const VOICE_SAVE_PHRASES = ["saved glimpse", "save glimpse", "glimpse save"];

export function GlimpseComposer({ projectId }: { projectId: string }) {
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // Android Chrome quietly ends a "continuous" session after a pause in
  // speech. We restart it automatically until the person actually stops, and
  // keep already-finalized text here because each restart resets the
  // browser's own results list.
  const committedRef = useRef("");
  const wantsListeningRef = useRef(false);
  // Mirrors `text` so the recognition callbacks (created once, and living
  // outside React's render cycle) can read the latest value without going
  // stale on a restart.
  const textRef = useRef("");
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // The Web Speech API's SpeechRecognition interface has no support on iOS at
  // all — not in Safari, and not in Chrome/Edge/Firefox for iOS either, since
  // every browser there runs on Apple's WebKit engine under the hood. Check
  // once on mount so we can show a clear inline explanation instead of a
  // mic button that silently does nothing when tapped.
  useEffect(() => {
    const w = window as unknown as {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      SpeechRecognition?: new () => SpeechRecognitionLike;
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVoiceSupported(Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition));
  }, []);

  // Release the mic if the person navigates away mid-recording.
  useEffect(() => {
    return () => {
      wantsListeningRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  function submit(opts?: { text?: string; pinned?: boolean }) {
    const value = (opts?.text ?? text).trim();
    if (!value) return;

    // Stop any in-progress voice capture first, so a stray word picked up
    // after saving never sneaks into the glimpse or keeps the mic open.
    if (listening) {
      wantsListeningRef.current = false;
      recognitionRef.current?.stop();
      setListening(false);
    }
    committedRef.current = "";

    const fd = new FormData();
    fd.set("projectId", projectId);
    fd.set("type", mode);
    if (mode === "voice") {
      fd.set("transcript", value);
    } else {
      fd.set("content", value);
    }
    if (opts?.pinned) fd.set("pinned", "true");

    startTransition(() => {
      createGlimpseAction(fd);
    });
    setText("");
  }

  function stopListening() {
    wantsListeningRef.current = false;
    recognitionRef.current?.stop();
    setListening(false);
  }

  function buildRecognition(Recognition: new () => SpeechRecognitionLike) {
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: unknown) => {
      const results = (event as {
        results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>;
      }).results;

      let sessionText = "";
      for (let i = 0; i < results.length; i++) {
        sessionText += results[i][0].transcript;
      }

      const full = `${committedRef.current}${sessionText}`;
      const trimmed = full.trim();
      const lower = trimmed.toLowerCase();
      const matchedPhrase = VOICE_SAVE_PHRASES.find((phrase) => lower.endsWith(phrase));

      if (matchedPhrase) {
        const spoken = trimmed.slice(0, trimmed.length - matchedPhrase.length).trim();
        committedRef.current = "";
        stopListening();
        setText(spoken);
        submit({ text: spoken, pinned: true });
        return;
      }

      setText(full);
    };

    recognition.onerror = (event: unknown) => {
      const code = (event as { error?: string }).error ?? "";
      // "no-speech" and "aborted" fire routinely during normal pauses on
      // mobile; let onend's restart handle those instead of alarming anyone.
      if (code === "no-speech" || code === "aborted") return;
      wantsListeningRef.current = false;
      setListening(false);
      setVoiceError(SPEECH_ERRORS[code] ?? `Voice capture failed (${code || "unknown error"}).`);
    };

    recognition.onend = () => {
      // Ended on its own (common on Android after a pause) but the person
      // never tapped stop — carry the text over and pick up where it left off.
      if (wantsListeningRef.current) {
        committedRef.current = textRef.current;
        try {
          recognition.start();
          return;
        } catch {
          // Some browsers refuse an immediate restart; fall through and stop.
        }
      }
      wantsListeningRef.current = false;
      setListening(false);
    };

    return recognition;
  }

  function toggleListening() {
    const w = window as unknown as {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      SpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Recognition = w.SpeechRecognition ?? w.webkitSpeechRecognition;

    if (!Recognition) {
      setVoiceSupported(false);
      return;
    }

    if (listening) {
      stopListening();
      return;
    }

    setVoiceError(null);
    // Keep anything already typed/dictated and append to it.
    committedRef.current = text ? (text.endsWith(" ") ? text : `${text} `) : "";

    try {
      const recognition = buildRecognition(Recognition);
      recognitionRef.current = recognition;
      wantsListeningRef.current = true;
      recognition.start();
      setListening(true);
    } catch {
      wantsListeningRef.current = false;
      setListening(false);
      setVoiceError("Couldn't start voice capture. Try reloading the page.");
    }
  }

  function handlePrompt(p: string) {
    setText((t) => (t ? `${t}\n${p}: ` : `${p}: `));
  }

  return (
    <div className="rounded-2xl bg-card border border-line p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setMode("text")}
          aria-pressed={mode === "text"}
          className={`text-xs px-3.5 py-1.5 rounded-full transition-all ${
            mode === "text"
              ? "bg-ink text-paper font-semibold shadow-md"
              : "bg-paper-deep text-ink-soft hover:text-ink"
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setMode("voice")}
          aria-pressed={mode === "voice"}
          className={`text-xs px-3.5 py-1.5 rounded-full transition-all ${
            mode === "voice"
              ? "bg-ink text-paper font-semibold shadow-md"
              : "bg-paper-deep text-ink-soft hover:text-ink"
          }`}
        >
          Voice
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
        className="w-full resize-none bg-transparent outline-none font-display text-lg placeholder:text-ink-soft/60"
      />

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => handlePrompt(p)}
              className="text-[11px] text-ink-soft border border-line rounded-full px-2.5 py-1 hover:border-ink hover:text-ink transition-colors"
            >
              {p}
            </button>
          ))}
          {mode === "voice" && voiceSupported && (
            <button
              onClick={toggleListening}
              aria-pressed={listening}
              className={`text-[11px] rounded-full px-2.5 py-1 border transition-all ${
                listening
                  ? "bg-accent text-paper border-accent font-semibold shadow-md is-busy"
                  : "border-line text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {listening ? "● Listening…" : "🎙 Start speaking"}
            </button>
          )}
        </div>
        <button
          onClick={() => submit()}
          disabled={pending || !text.trim()}
          className={`text-xs rounded-full bg-ink text-paper px-4 py-2 shadow-sm hover:opacity-90 transition-opacity disabled:opacity-40 ${
            pending ? "is-busy" : ""
          }`}
        >
          {pending ? "Saving…" : "Save glimpse"}
        </button>
      </div>
      {mode === "voice" && listening && (
        <p className="text-[11px] text-ink-soft mt-2">
          Say <span className="italic">&ldquo;saved glimpse&rdquo;</span>,{" "}
          <span className="italic">&ldquo;save glimpse&rdquo;</span>, or{" "}
          <span className="italic">&ldquo;glimpse save&rdquo;</span> to stop, save, and pin it.
        </p>
      )}
      {mode === "voice" && voiceError && (
        <p className="text-[11px] text-accent mt-2">{voiceError}</p>
      )}
      {mode === "voice" && !voiceSupported && (
        <p className="text-[11px] text-ink-soft mt-2">
          Voice capture isn&apos;t available in this browser. Every browser on iPhone or iPad runs on
          Apple&apos;s engine, which doesn&apos;t support speech recognition yet — this works in Chrome or
          Edge on desktop, or Chrome on Android. You can still type your glimpse here in the meantime.
        </p>
      )}
      <form ref={formRef} className="hidden" />
    </div>
  );
}
