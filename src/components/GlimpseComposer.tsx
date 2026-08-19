"use client";

import { useRef, useState, useTransition } from "react";
import { createGlimpseAction } from "@/lib/actions/glimpses";

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: unknown) => void) | null;
  onend: (() => void) | null;
};

const PROMPTS = ["Quick note", "Dialogue", "Scene", "Question"];

// Say this at the end of a voice glimpse to stop listening, save it, and pin
// it automatically — a hands-free way to close out a thought.
const VOICE_SAVE_PHRASE = "saved glimpse";

export function GlimpseComposer({ projectId }: { projectId: string }) {
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [pending, startTransition] = useTransition();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function submit(opts?: { text?: string; pinned?: boolean }) {
    const value = (opts?.text ?? text).trim();
    if (!value) return;

    // Stop any in-progress voice capture first, so a stray word picked up
    // after saving never sneaks into the glimpse or keeps the mic open.
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    }

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

  function toggleListening() {
    const w = window as unknown as {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      SpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Recognition = w.SpeechRecognition ?? w.webkitSpeechRecognition;

    if (!Recognition) {
      alert("Voice capture isn't supported in this browser yet — try Chrome, or type your glimpse.");
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: unknown) => {
      const results = (event as { results: ArrayLike<{ 0: { transcript: string } }> }).results;
      let finalText = "";
      for (let i = 0; i < results.length; i++) {
        finalText += results[i][0].transcript;
      }

      const trimmed = finalText.trim();
      if (trimmed.toLowerCase().endsWith(VOICE_SAVE_PHRASE)) {
        const spoken = trimmed.slice(0, trimmed.length - VOICE_SAVE_PHRASE.length).trim();
        recognitionRef.current?.stop();
        setListening(false);
        setText(spoken);
        submit({ text: spoken, pinned: true });
        return;
      }

      setText(finalText);
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function handlePrompt(p: string) {
    setText((t) => (t ? `${t}\n${p}: ` : `${p}: `));
  }

  return (
    <div className="rounded-2xl bg-card border border-line p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={() => setMode("text")}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            mode === "text" ? "bg-ink text-paper" : "bg-paper-deep text-ink-soft"
          }`}
        >
          Text
        </button>
        <button
          onClick={() => setMode("voice")}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            mode === "voice" ? "bg-ink text-paper" : "bg-paper-deep text-ink-soft"
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
          {mode === "voice" && (
            <button
              onClick={toggleListening}
              className={`text-[11px] rounded-full px-2.5 py-1 border transition-colors ${
                listening
                  ? "bg-accent text-paper border-accent"
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
          className="text-xs rounded-full bg-ink text-paper px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          Save glimpse
        </button>
      </div>
      {mode === "voice" && listening && (
        <p className="text-[11px] text-ink-soft mt-2">
          Say <span className="italic">&ldquo;saved glimpse&rdquo;</span> to stop, save, and pin it.
        </p>
      )}
      <form ref={formRef} className="hidden" />
    </div>
  );
}
