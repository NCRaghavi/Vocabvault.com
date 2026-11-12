import Link from "next/link";
import { getAllWords } from "@/lib/content";

/** A–Z links; letters with no words yet are shown greyed out instead of leading to an empty page. */
export default function LetterBar({ active = "" }: { active?: string }) {
  const counts: Record<string, number> = {};
  for (const w of getAllWords()) {
    const l = w.slug.charAt(0).toLowerCase();
    counts[l] = (counts[l] || 0) + 1;
  }
  return (
    <nav aria-label="Browse by letter" className="mt-6 flex flex-wrap justify-center gap-1.5">
      {"abcdefghijklmnopqrstuvwxyz".split("").map((l) =>
        counts[l] ? (
          <Link
            key={l}
            href={`/vault/${l}`}
            title={`${counts[l]} word${counts[l] === 1 ? "" : "s"}`}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border ${
              l === active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
            }`}
          >
            {l.toUpperCase()}
          </Link>
        ) : (
          <span key={l} aria-hidden="true" className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border border-slate-100 bg-slate-50 text-slate-300">
            {l.toUpperCase()}
          </span>
        )
      )}
    </nav>
  );
}
