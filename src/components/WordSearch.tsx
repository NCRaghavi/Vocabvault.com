"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type Row = [string, string, string];

export default function WordSearch() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [q, setQ] = useState("");
  const loading = useRef(false);

  const load = () => {
    if (rows || loading.current) return;
    loading.current = true;
    fetch("/words-index.json")
      .then((r) => r.json())
      .then((d: Row[]) => setRows(d))
      .catch(() => setRows([]));
  };

  useEffect(() => {
    if (q) load();
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const hits = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t || !rows) return [];
    const starts = rows.filter((r) => r[0].toLowerCase().startsWith(t));
    const contains = rows.filter((r) => !r[0].toLowerCase().startsWith(t) && (r[0].toLowerCase().includes(t) || (t.length > 3 && r[2].toLowerCase().includes(t))));
    return [...starts, ...contains].slice(0, 12);
  }, [q, rows]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <label className="flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500/30">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="search"
          value={q}
          onFocus={load}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Look up a word, e.g. laconic"
          aria-label="Search the vocabulary vault"
          className="w-full outline-none text-base bg-transparent"
        />
      </label>
      {q.trim() && (
        <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden text-left">
          {rows === null ? (
            <p className="px-4 py-3 text-sm text-slate-500">Searching…</p>
          ) : hits.length ? (
            hits.map((r) => (
              <Link key={r[1]} href={`/words/${r[1]}`} className="block px-4 py-2.5 hover:bg-blue-50">
                <span className="font-semibold text-slate-900">{r[0]}</span>
                <span className="text-sm text-slate-500"> · {r[2]}</span>
              </Link>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-slate-600">“{q}” isn&apos;t in the vault yet. New words are added every night.</p>
          )}
        </div>
      )}
    </div>
  );
}
