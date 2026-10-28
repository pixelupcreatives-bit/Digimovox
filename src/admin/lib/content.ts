import type { InsightArticle } from "@/types";

export type ContentBlock = InsightArticle["content"][number];

/**
 * Parse simple human-friendly markup into article content blocks.
 *
 *   ## Heading          → h2
 *   ### Subheading      → h3
 *   - list item         → list (consecutive "-" lines are grouped)
 *   anything else       → p
 *
 * Blank lines separate blocks. Used by the Blog editor so non-technical
 * editors can write content without touching structured fields.
 */
export function parseContent(markup: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      blocks.push({ type: "list", text: listBuffer.join("\n") });
      listBuffer = [];
    }
  };

  for (const rawLine of markup.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith("### ")) {
      flushList();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
    } else if (line.startsWith("## ")) {
      flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listBuffer.push(line.slice(2).trim());
    } else {
      flushList();
      blocks.push({ type: "p", text: line });
    }
  }
  flushList();
  return blocks;
}

/** Reverse of parseContent — used when opening an existing article for edit. */
export function serializeContent(blocks: ContentBlock[]): string {
  return blocks
    .map((b) => {
      if (b.type === "h2") return `## ${b.text}`;
      if (b.type === "h3") return `### ${b.text}`;
      if (b.type === "list") return b.text.split("\n").map((l) => `- ${l}`).join("\n");
      return b.text;
    })
    .join("\n\n");
}
