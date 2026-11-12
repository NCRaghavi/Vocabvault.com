import Link from "next/link";
import { Fragment, type ReactNode } from "react";

/**
 * A small, safe Markdown renderer for lessons and word notes:
 * headings (##, ###), paragraphs, bullet and numbered lists, > quotes,
 * **bold**, *italic*, `code` and [links](/path). Raw HTML is never rendered.
 */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${keyBase}-${i++}`;
    if (m[1]) {
      const href = m[3];
      const internal = href.startsWith("/");
      const safe = internal || /^https?:\/\//.test(href);
      out.push(
        !safe ? (
          m[2]
        ) : internal ? (
          <Link key={k} href={href} className="text-blue-700 font-semibold hover:underline">
            {m[2]}
          </Link>
        ) : (
          <a key={k} href={href} rel="noopener noreferrer" target="_blank" className="text-blue-700 font-semibold hover:underline">
            {m[2]}
          </a>
        )
      );
    } else if (m[4]) out.push(<strong key={k}>{m[5]}</strong>);
    else if (m[6]) out.push(<em key={k}>{m[7]}</em>);
    else if (m[8]) out.push(<code key={k} className="px-1 rounded bg-slate-100 text-sm">{m[9]}</code>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** One line of text with **bold**, *italic* and links, for short fields like memory tricks. */
export function MdInline({ text }: { text: string }) {
  return <>{inline(text, "i")}</>;
}

export default function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let n = 0;
  while (i < lines.length) {
    const line = lines[i];
    const k = `b${n++}`;
    if (!line.trim()) {
      i++;
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = Math.min(4, Math.max(2, h[1].length));
      const cls = level === 2 ? "text-2xl font-extrabold text-slate-900 mt-8 mb-3" : "text-lg font-bold text-slate-900 mt-6 mb-2";
      blocks.push(
        level === 2 ? <h2 key={k} className={cls}>{inline(h[2], k)}</h2> : level === 3 ? <h3 key={k} className={cls}>{inline(h[2], k)}</h3> : <h4 key={k} className={cls}>{inline(h[2], k)}</h4>
      );
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
      const ordered = /^\s*\d+[.)]\s+/.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/).test(lines[i])) {
        items.push(lines[i].replace(ordered ? /^\s*\d+[.)]\s+/ : /^\s*[-*]\s+/, ""));
        i++;
      }
      const li = items.map((t, j) => <li key={`${k}-${j}`}>{inline(t, `${k}-${j}`)}</li>);
      blocks.push(ordered ? <ol key={k} className="list-decimal pl-6 space-y-1.5 my-4">{li}</ol> : <ul key={k} className="list-disc pl-6 space-y-1.5 my-4">{li}</ul>);
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote key={k} className="border-l-4 border-blue-300 bg-slate-50 rounded-r-xl px-4 py-3 my-4 font-serif text-slate-800">
          {quote.filter((q) => q.trim()).map((q, j) => (
            <p key={j} className="my-1">{inline(q, `${k}-${j}`)}</p>
          ))}
        </blockquote>
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|>|\s*[-*]\s+|\s*\d+[.)]\s+)/.test(lines[i])) {
      para.push(lines[i].trim());
      i++;
    }
    if (!para.length) {
      i++; // safety: never loop on a line no rule consumed
      continue;
    }
    blocks.push(<p key={k} className="my-4 leading-relaxed">{inline(para.join(" "), k)}</p>);
  }
  return <div className="text-slate-700 text-base sm:text-lg">{blocks.map((b, j) => <Fragment key={j}>{b}</Fragment>)}</div>;
}
