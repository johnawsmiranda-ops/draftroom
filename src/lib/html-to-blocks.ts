// Turns the contentEditable HTML produced by the Writing Mode editor into a
// flat list of simple paragraph blocks with inline styling, so both the
// Word (.docx) and PDF exporters can share one parser instead of each
// re-implementing HTML parsing. Deliberately hand-rolled rather than a DOM
// parser dependency, since the editor only ever emits a small, predictable
// set of tags (b/strong, i/em, u, p, div, ul/ol/li, br).

export type Run = { text: string; bold: boolean; italic: boolean; underline: boolean };
export type Block = { runs: Run[]; listItem: boolean; ordered: boolean };

const ENTITIES: Record<string, string> = {
  "&nbsp;": " ",
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
};

function decodeEntities(text: string): string {
  return text.replace(/&(nbsp|amp|lt|gt|quot|#39|apos);/g, (m) => ENTITIES[m] ?? m);
}

export function htmlToBlocks(html: string): Block[] {
  const blocks: Block[] = [];
  let buffer: Run[] = [];
  let bold = false;
  let italic = false;
  let underline = false;
  const listStack: ("ul" | "ol")[] = [];
  let inListItem = false;

  function flush() {
    const trimmed = buffer.filter((r) => r.text.length > 0);
    if (trimmed.length > 0) {
      blocks.push({
        runs: trimmed,
        listItem: inListItem,
        ordered: listStack[listStack.length - 1] === "ol",
      });
    }
    buffer = [];
  }

  const tagRe = /<[^>]+>/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = tagRe.exec(html))) {
    if (m.index > lastIndex) {
      const text = decodeEntities(html.slice(lastIndex, m.index));
      if (text) buffer.push({ text, bold, italic, underline });
    }
    const tag = m[0].toLowerCase();

    if (/^<(b|strong)\b/.test(tag)) bold = true;
    else if (/^<\/(b|strong)>/.test(tag)) bold = false;
    else if (/^<(i|em)\b/.test(tag)) italic = true;
    else if (/^<\/(i|em)>/.test(tag)) italic = false;
    else if (/^<u\b/.test(tag)) underline = true;
    else if (/^<\/u>/.test(tag)) underline = false;
    else if (/^<ul\b/.test(tag)) listStack.push("ul");
    else if (/^<ol\b/.test(tag)) listStack.push("ol");
    else if (/^<\/(ul|ol)>/.test(tag)) listStack.pop();
    else if (/^<li\b/.test(tag)) {
      flush();
      inListItem = true;
    } else if (/^<\/li>/.test(tag)) {
      flush();
      inListItem = false;
    } else if (/^<br\s*\/?>/.test(tag)) {
      flush();
    } else if (/^<\/(p|div)>/.test(tag)) {
      flush();
    }
    // Opening <p>/<div> tags and anything else are ignored — a matching
    // close (or the next block boundary) triggers the flush.

    lastIndex = tagRe.lastIndex;
  }
  if (lastIndex < html.length) {
    const text = decodeEntities(html.slice(lastIndex));
    if (text) buffer.push({ text, bold, italic, underline });
  }
  flush();

  return blocks;
}
