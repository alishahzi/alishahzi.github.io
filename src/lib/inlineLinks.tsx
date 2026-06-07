import { ReactNode } from "react";

// Converts inline markup of the form  [label](url)  into clickable <a> tags.
// All other text is passed through as plain strings, so it's safe to render
// directly inside <p>, <span>, etc.
//
// Example:
//   inlineLinks("PhD at [Università di Bologna](https://www.unibo.it/en).")
//   → ["PhD at ", <a>Università di Bologna</a>, "."]

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export function inlineLinks(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  // create a fresh regex per call to avoid sticky-state bugs
  const re = new RegExp(LINK_RE.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const [, label, url] = match;
    out.push(
      <a
        key={`l-${out.length}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 transition-colors"
      >
        {label}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
