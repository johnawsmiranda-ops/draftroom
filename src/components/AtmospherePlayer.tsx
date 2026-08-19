"use client";

import { useEffect, useRef, useState } from "react";

type Track = "instrumental" | "focus" | "ambient" | "rain" | "cafe" | "piano" | "silence";

const TRACKS: { id: Track; label: string }[] = [
  { id: "instrumental", label: "Instrumental" },
  { id: "focus", label: "Focus" },
  { id: "ambient", label: "Ambient" },
  { id: "rain", label: "Rain" },
  { id: "cafe", label: "Café" },
  { id: "piano", label: "Piano" },
  { id: "silence", label: "Silence" },
];

// Placeholder ambient sound generation (Web Audio synthesis — no external audio assets).
// Lives outside the component so it never runs during render, only from event handlers.
function buildSound(ctx: AudioContext, t: Track, gainNode: GainNode) {
  if (t === "silence") return { stop: () => {} };

  if (t === "rain" || t === "cafe") {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = t === "rain" ? 900 : 1400;
    noise.connect(filter).connect(gainNode);
    noise.start();
    return { stop: () => noise.stop() };
  }

  // instrumental / focus / ambient / piano: soft layered tones
  const freqs: Record<string, number[]> = {
    instrumental: [220, 330, 440],
    focus: [196, 294],
    ambient: [174, 261, 348],
    piano: [261, 392],
  };
  const oscillators = (freqs[t] ?? [220]).map((f, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const oscGain = ctx.createGain();
    oscGain.gain.value = 1 / (i + 2);
    osc.connect(oscGain).connect(gainNode);
    osc.start();
    return osc;
  });
  return { stop: () => oscillators.forEach((o) => o.stop()) };
}

export function AtmospherePlayer({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const [track, setTrack] = useState<Track>("silence");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);

  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      nodesRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  function handlePlayPause() {
    if (playing) {
      nodesRef.current?.stop();
      nodesRef.current = null;
      ctxRef.current?.suspend();
      setPlaying(false);
      return;
    }
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    ctx.resume();
    const gainNode = ctx.createGain();
    gainNode.gain.value = volume * 0.15;
    gainNode.connect(ctx.destination);
    gainRef.current = gainNode;
    nodesRef.current = buildSound(ctx, track, gainNode);
    setPlaying(true);
  }

  function handleTrack(t: Track) {
    setTrack(t);
    if (playing) {
      nodesRef.current?.stop();
      const ctx = ctxRef.current!;
      const gainNode = ctx.createGain();
      gainNode.gain.value = volume * 0.15;
      gainNode.connect(ctx.destination);
      gainRef.current = gainNode;
      nodesRef.current = buildSound(ctx, t, gainNode);
    }
  }

  function handleVolume(v: number) {
    setVolume(v);
    if (gainRef.current) gainRef.current.gain.value = v * 0.15;
  }

  const base = dark
    ? "bg-room-card border-room-line text-paper/80"
    : "bg-card border-line text-ink";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`text-sm px-2.5 py-1.5 rounded-full border ${base} hover:opacity-80 transition-opacity`}
        title="Writing atmosphere"
      >
        {playing ? "♪" : "♫"}
      </button>
      {open && (
        <div className={`absolute right-0 mt-2 w-56 rounded-xl border p-3 shadow-lg z-50 ${base}`}>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTrack(t.id)}
                className={`text-[11px] px-2 py-1 rounded-full border transition-colors ${
                  track === t.id
                    ? dark
                      ? "bg-paper text-room border-paper"
                      : "bg-ink text-paper border-ink"
                    : "border-current opacity-70 hover:opacity-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePlayPause} className="text-xs underline underline-offset-2">
              {playing ? "Pause" : "Play"}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => handleVolume(Number(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  );
}
