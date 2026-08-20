"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Article = {
  title: string;
  body: string;
  soon?: boolean;
};

type Category = {
  key: string;
  title: string;
  articles: Article[];
};

const CATEGORIES: Category[] = [
  {
    key: "getting-started",
    title: "Getting Started",
    articles: [
      {
        title: "What is Draftroom?",
        body: "Draftroom is a room for the ideas that aren't ready yet, and a separate room for the writing once they are. Glimpse Mode is where fragments land the moment they arrive — a line, a voice memo, a photo of something. Writing Mode is where you turn the glimpses you're ready for into an actual manuscript, chapter by chapter. Nothing here writes for you; every word that ends up on the page is yours.",
      },
      {
        title: "Creating your first project",
        body: "A project is the room for one piece of work — a novel, a sermon series, a collection of songs. From Home, choose \"New project,\" give it a name, and optionally start from a template (Novel, Sermon, Poem, Song, Script, or Essay) that seeds a sensible starting structure. You can always rename chapters or add your own later — templates are a starting point, not a cage.",
      },
      {
        title: "Understanding Glimpse Mode",
        body: "Glimpse Mode is for capture, not composition. Jot a stray sentence, record a voice thought, save a photo or a link — whatever the idea arrives as. Glimpses live on a draggable Wall or in chronological Timeline view, and nothing about them expects you to finish anything right away.",
      },
      {
        title: "Understanding Writing Mode",
        body: "Writing Mode is where a project's actual manuscript lives — organized into Documents and, within each Document, reorderable Chapters. It has a distraction-light editor, autosave, a Manuscript Spine (table of contents) for jumping between chapters, and a \"Lights Off\" fullscreen mode for when you just want the page and nothing else.",
      },
    ],
  },
  {
    key: "glimpse-mode",
    title: "Glimpse Mode",
    articles: [
      {
        title: "What is a Glimpse?",
        body: "A Glimpse is the smallest unit of an idea in Draftroom — a bit of text, a voice recording, a photo, or a link. It's meant to take seconds to create, so the idea gets caught before it's gone. You can pin a Glimpse, give it a color, and come back to it whenever you're ready to develop it into real writing.",
      },
      {
        title: "Creating and organizing ideas",
        body: "Add a Glimpse from a project's Glimpses tab — choose text or voice, type or speak, and it's saved instantly. Drag Glimpses around the Wall to group related ones near each other, pin the ones you don't want to lose track of, and delete the ones that have run their course.",
      },
      {
        title: "Glimpse Wall",
        body: "The Wall is a freeform, draggable board of sticky-note-style Glimpses — closer to a corkboard than a list. Position is up to you; Draftroom remembers where you left each note.",
      },
      {
        title: "Timeline view",
        body: "Timeline shows the same Glimpses in the order you captured them, newest first. It's the better view when you want to retrace how an idea evolved, rather than where you happened to drop it on the Wall.",
      },
      {
        title: "Voice capture",
        body: "Tap the microphone in the Glimpse composer and speak — Draftroom transcribes it right there in your browser, no recording uploaded anywhere for processing. Say a phrase like \"save glimpse\" or \"pin save\" while a voice note is open and it'll save (and pin) automatically, so you don't have to touch the screen at all.",
      },
    ],
  },
  {
    key: "writing-mode",
    title: "Writing Mode",
    articles: [
      {
        title: "Creating documents",
        body: "Inside a project's Manuscript tab, choose \"New document\" to start a fresh manuscript. Each document holds its own set of chapters, so a single project can hold more than one manuscript — drafts of the same piece, or genuinely separate pieces, side by side.",
      },
      {
        title: "Writing templates",
        body: "When creating a project, you can start from a template — Novel, Sermon, Poem, Song, Script, or Essay — which pre-fills a sensible set of starting chapters (Plot, Characters, World, Timeline for a novel, for instance). Chapters are always freeform after that: rename, reorder, add, or delete them however the piece actually wants to grow.",
      },
      {
        title: "Lights Off mode",
        body: "Lights Off strips the writing view down to just the page — a fullscreen, distraction-light mode for when the rest of the interface is more noise than help. Toggle it from the writing toolbar; toggle it back the same way.",
      },
      {
        title: "Writing atmosphere",
        body: "Draftroom can play a soft, synthesized ambient background while you write, if that kind of low hum helps you settle in. It's entirely optional and lives in the writing toolbar alongside Lights Off.",
      },
      {
        title: "Autosave",
        body: "Everything you write in Writing Mode saves automatically as you type — word count included. There's no save button to remember, and no draft that only exists in a browser tab you might accidentally close.",
      },
    ],
  },
  {
    key: "projects",
    title: "Projects",
    articles: [
      {
        title: "Creating projects",
        body: "From Home or the sidebar, choose \"New project.\" Give it a name (the only required step) and, optionally, a starting template. Every project gets its own Glimpses, Manuscript, and Writing Dates — separate rooms for separate pieces of work.",
      },
      {
        title: "Managing chapters",
        body: "Open a project's Manuscript tab to see its Manuscript Spine — every chapter, in order, with an Open button to jump straight into writing. Drag the handle on the left of a chapter to reorder it, click a title to rename it in place, and use the delete icon to remove one you no longer need.",
      },
      {
        title: "Moving ideas between projects",
        body: "This isn't available yet — a Glimpse currently belongs to the project it was captured in. If you need the same idea in two places for now, the workaround is re-creating it as a new Glimpse in the other project. Moving Glimpses between projects directly is on the list for a future update.",
        soon: true,
      },
    ],
  },
  {
    key: "sharing-export",
    title: "Sharing & Export",
    articles: [
      {
        title: "Exporting to Word",
        body: "Open any document in Writing Mode and use the Export menu to download it as a .docx file, ready to open in Microsoft Word or Google Docs.",
      },
      {
        title: "Exporting to PDF",
        body: "The same Export menu in Writing Mode also offers PDF — a clean, ready-to-share or ready-to-print version of your manuscript.",
      },
      {
        title: "Creating Quote Cards",
        body: "Shareable quote-card images (a single line or passage, styled for sharing) aren't built yet. Word and PDF export are available today; Quote Cards are on the roadmap.",
        soon: true,
      },
      {
        title: "Creating Short Formats",
        body: "Exporting shorter, social-ready formats from a longer piece isn't available yet either. For now, Word and PDF export cover the full manuscript.",
        soon: true,
      },
    ],
  },
  {
    key: "account",
    title: "Account",
    articles: [
      {
        title: "Profile settings",
        body: "Your Profile page (in the sidebar) lets you update your display name and profile photo. Your email address is shown there too, used for logging in.",
      },
      {
        title: "Password reset",
        body: "Self-serve password reset isn't available yet. If you're locked out of your account in the meantime, reach out through the Support page and we'll help you back in.",
        soon: true,
      },
      {
        title: "Privacy settings",
        body: "Dedicated privacy controls aren't built yet. In the meantime: your writing is stored to power the app itself and is never used to train any AI model, and nothing you write is read or processed by AI of any kind — Draftroom doesn't do AI writing generation. See our Privacy Policy for the full picture.",
        soon: true,
      },
      {
        title: "Account deletion",
        body: "Self-serve account deletion isn't available yet. Contact Support and we'll take care of removing your account and its data.",
        soon: true,
      },
    ],
  },
];

export function HelpCenter() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.map((cat) => ({
      ...cat,
      articles: cat.articles.filter(
        (a) => a.title.toLowerCase().includes(q) || a.body.toLowerCase().includes(q),
      ),
    })).filter((cat) => cat.articles.length > 0);
  }, [query]);

  return (
    <div>
      <div className="mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the help center…"
          aria-label="Search the help center"
          className="w-full rounded-full border border-line bg-card px-6 py-3.5 text-sm outline-none focus:border-ink/40 transition-colors"
        />
      </div>

      {CATEGORIES.length > 0 && (
        <nav className="hidden sm:flex flex-wrap gap-x-6 gap-y-2 mb-14 text-sm text-ink-soft border-b border-line pb-8">
          {CATEGORIES.map((cat) => (
            <a key={cat.key} href={`#${cat.key}`} className="hover:text-ink transition-colors">
              {cat.title}
            </a>
          ))}
        </nav>
      )}

      {filtered.length === 0 && (
        <p className="text-ink-soft text-sm">
          Nothing matched &ldquo;{query}&rdquo;. Try a different word, or{" "}
          <Link href="/support" className="text-ink underline underline-offset-2">
            ask Support
          </Link>{" "}
          directly.
        </p>
      )}

      <div className="space-y-16">
        {filtered.map((cat) => (
          <section key={cat.key} id={cat.key} className="scroll-mt-8">
            <h2 className="font-display text-2xl mb-6">{cat.title}</h2>
            <div className="space-y-8">
              {cat.articles.map((article) => (
                <div key={article.title}>
                  <h3 className="text-base font-medium flex items-center gap-2 mb-1.5">
                    {article.title}
                    {article.soon && (
                      <span className="text-[10px] uppercase tracking-wide text-accent border border-accent/30 rounded-full px-2 py-0.5">
                        Coming soon
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-ink-soft leading-relaxed max-w-2xl">{article.body}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
