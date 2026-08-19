// Starter structures for new projects. Each template just seeds a Document
// with a set of named Chapters — Chapters already are freeform, reorderable,
// renameable, deletable sections, so a "template" doesn't need a new data
// model, only a smarter starting point than a single blank "Chapter 1".

export type TemplateKey = "sermon" | "novel" | "poem" | "song" | "script" | "essay";

export type Template = {
  key: TemplateKey;
  category: string;
  label: string;
  description: string;
  includes: string[];
};

export const TEMPLATES: Template[] = [
  {
    key: "sermon",
    category: "Sermons",
    label: "Sermon / Message",
    description: "Organize your sermon from message to application.",
    includes: ["Outline", "Scripture", "Illustrations", "Notes"],
  },
  {
    key: "novel",
    category: "Novels",
    label: "Novel",
    description: "Build your novel with structure that keeps your story flowing.",
    includes: ["Chapter 1", "Plot", "Characters", "World", "Timeline"],
  },
  {
    key: "poem",
    category: "Poems",
    label: "Poem",
    description: "A space for lines that breathe and words that linger.",
    includes: ["Poems", "Themes", "Inspiration", "Drafts"],
  },
  {
    key: "song",
    category: "Songs",
    label: "Song / Lyrics",
    description: "Capture lyrics, chords, melodies, and ideas.",
    includes: ["Lyrics", "Chords", "Sections", "Notes"],
  },
  {
    key: "script",
    category: "Scripts",
    label: "Script / Screenplay",
    description: "Write scenes that bring your story to life on screen.",
    includes: ["Scenes", "Characters", "Locations", "Shot Notes"],
  },
  {
    key: "essay",
    category: "Essays",
    label: "Essay / Article",
    description: "Research, outline, and write with clarity and flow.",
    includes: ["Outline", "Research", "Drafts", "References"],
  },
];

export function getTemplate(key?: string | null): Template | undefined {
  return TEMPLATES.find((t) => t.key === key);
}
