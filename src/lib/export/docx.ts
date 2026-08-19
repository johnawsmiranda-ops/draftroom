import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { htmlToBlocks } from "@/lib/html-to-blocks";

type Chapter = { title: string; content: string };
type DocInput = { title: string; chapters: Chapter[] };

export async function buildDocxBuffer(doc: DocInput): Promise<Buffer> {
  const children: Paragraph[] = [
    new Paragraph({
      text: doc.title,
      heading: HeadingLevel.TITLE,
    }),
  ];

  for (const chapter of doc.chapters) {
    children.push(
      new Paragraph({
        text: chapter.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      }),
    );

    const blocks = htmlToBlocks(chapter.content);
    if (blocks.length === 0) {
      children.push(new Paragraph({ text: "" }));
      continue;
    }

    for (const block of blocks) {
      children.push(
        new Paragraph({
          bullet: block.listItem && !block.ordered ? { level: 0 } : undefined,
          numbering: block.listItem && block.ordered ? { reference: "chapter-numbering", level: 0 } : undefined,
          spacing: { after: 160 },
          children: block.runs.map(
            (run) =>
              new TextRun({
                text: run.text,
                bold: run.bold,
                italics: run.italic,
                underline: run.underline ? {} : undefined,
              }),
          ),
        }),
      );
    }
  }

  const document = new Document({
    numbering: {
      config: [
        {
          reference: "chapter-numbering",
          levels: [{ level: 0, format: "decimal", text: "%1.", alignment: "start" }],
        },
      ],
    },
    sections: [{ children }],
  });

  return Packer.toBuffer(document);
}
