"use client";

/**
 * "My words": a revision list kept in the student's own browser (no login).
 * Missed quiz words are added automatically; any word page can add or remove a word.
 */
export interface SavedWord {
  word: string;
  slug: string;
  reason: "missed" | "saved";
  exam?: string;
  addedAt: string;
}

const KEY = "vvp_my_words";
const EVENT = "vvp-my-words";

export const toSlug = (w: string) => w.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function readMyWords(): SavedWord[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function write(list: SavedWord[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 500)));
  } catch {
    /* storage full or private mode: ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function addMyWords(items: Omit<SavedWord, "addedAt">[]): number {
  const list = readMyWords();
  let added = 0;
  for (const it of items) {
    if (!it.slug || list.some((x) => x.slug === it.slug)) continue;
    list.unshift({ ...it, addedAt: new Date().toISOString().slice(0, 10) });
    added++;
  }
  if (added) write(list);
  return added;
}

export function removeMyWord(slug: string) {
  write(readMyWords().filter((x) => x.slug !== slug));
}

export function onMyWordsChange(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
