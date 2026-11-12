"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readMyWords, removeMyWord, onMyWordsChange, addMyWords, type SavedWord } from "@/lib/myWords";
import { Bookmark, BookmarkCheck, Check, ListChecks } from "lucide-react";

function useMyWords(): SavedWord[] | null {
  const [list, setList] = useState<SavedWord[] | null>(null);
  useEffect(() => {
    const load = () => setList(readMyWords());
    load();
    return onMyWordsChange(load);
  }, []);
  return list;
}

/** Full list for the /my-words page. */
export function MyWordsList() {
  const list = useMyWords();
  if (list === null) return null;
  if (!list.length)
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center">
        <p className="font-bold text-slate-900">Your list is empty</p>
        <p className="mt-1 text-sm text-slate-600">
          Words you miss in a Sunday quiz land here automatically. You can also tap “Save to My words” on any word page.
        </p>
      </div>
    );
  return (
    <ul className="space-y-2">
      {list.map((w) => (
        <li key={w.slug} className="flex items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3">
          <Link href={`/words/${w.slug}`} className="group">
            <span className="font-bold text-slate-900 group-hover:text-blue-700">{w.word}</span>
            <span className="ml-2 text-xs text-slate-500">
              {w.reason === "missed" ? `missed in ${w.exam || "a"} quiz` : "saved"} · {w.addedAt}
            </span>
          </Link>
          <button
            type="button"
            onClick={() => removeMyWord(w.slug)}
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> I know it now
          </button>
        </li>
      ))}
    </ul>
  );
}

/** Small homepage card, shown only when the list has words. */
export function MyWordsCard() {
  const list = useMyWords();
  if (!list || !list.length) return null;
  return (
    <Link href="/my-words" className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 hover:border-amber-300">
      <span className="flex items-center gap-3">
        <ListChecks className="w-5 h-5 text-amber-700" />
        <span>
          <span className="block font-bold text-slate-900">
            {list.length} word{list.length === 1 ? "" : "s"} to revise
          </span>
          <span className="text-sm text-slate-600">{list.slice(0, 4).map((w) => w.word).join(", ")}{list.length > 4 ? "…" : ""}</span>
        </span>
      </span>
      <span className="text-sm font-bold text-amber-800">Open My words →</span>
    </Link>
  );
}

/** Header link with a count badge. */
export function MyWordsNavLink({ className = "" }: { className?: string }) {
  const list = useMyWords();
  const n = list?.length || 0;
  return (
    <Link href="/my-words" className={className}>
      My words{n ? <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold">{n}</span> : null}
    </Link>
  );
}

/** Save / remove button on a word page. */
export function SaveWordButton({ word, slug }: { word: string; slug: string }) {
  const list = useMyWords();
  const saved = !!list?.some((w) => w.slug === slug);
  return (
    <button
      type="button"
      onClick={() => (saved ? removeMyWord(slug) : addMyWords([{ word, slug, reason: "saved" }]))}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border cursor-pointer ${
        saved ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
      }`}
    >
      {saved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
      {saved ? "In My words" : "Save to My words"}
    </button>
  );
}
