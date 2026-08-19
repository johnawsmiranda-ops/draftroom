// Paper/canvas presets for the Writing Mode surface itself — separate from
// the Lights On/Off focus toggle, which dims the surrounding chrome
// regardless of which paper style is chosen underneath it.

export type WritingFormatKey = "plain-white" | "warm-cream" | "ruled-lines" | "dark-paper";

export type WritingFormatPreset = {
  key: WritingFormatKey;
  label: string;
  description: string;
  premium: boolean;
  bg: string;
  text: string;
  // Optional inline CSS background for textured presets (ruled lines) that
  // a flat Tailwind color class can't express.
  backgroundImage?: string;
};

export const WRITING_FORMATS: WritingFormatPreset[] = [
  {
    key: "plain-white",
    label: "Plain White",
    description: "Clean, simple, and distraction-free. Perfect for focused writing.",
    premium: false,
    bg: "#ffffff",
    text: "#1c1a17",
  },
  {
    key: "warm-cream",
    label: "Warm Cream",
    description: "A soft, warm tone that's easy on the eyes for long writing sessions.",
    premium: false,
    bg: "#f6ecd9",
    text: "#2a2420",
  },
  {
    key: "ruled-lines",
    label: "Ruled Lines",
    description: "Classic lines to keep your thoughts aligned and your writing flowing.",
    premium: false,
    bg: "#fbf3e3",
    text: "#2a2420",
    backgroundImage:
      "linear-gradient(to right, transparent 46px, rgba(196, 74, 74, 0.35) 47px, rgba(196, 74, 74, 0.35) 48px, transparent 49px), repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(120, 100, 70, 0.18) 32px)",
  },
  {
    key: "dark-paper",
    label: "Dark Paper",
    description: "A calm, minimal dark space that helps you focus on what matters.",
    premium: false,
    bg: "#181614",
    text: "#efe9e2",
  },
];

export function getWritingFormat(key?: string | null): WritingFormatPreset {
  return WRITING_FORMATS.find((f) => f.key === key) ?? WRITING_FORMATS[0];
}
