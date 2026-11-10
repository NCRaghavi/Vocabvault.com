import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface MemoryTrick {
  mnemonic: string;
  etymology: string;
}

export interface QuickCheck {
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface WordItem {
  word: string;
  slug: string;
  phonetic: string;
  partOfSpeech: string;
  definitionSnippet: string;
  fullDefinition: string;
  examTags: string[];
  dateAdded: string;
  inContext: string;
  examples: string[];
  synonyms: string[];
  synonymNuance: string;
  antonyms: string[];
  memoryTrick: MemoryTrick;
  examNote: string;
  quickCheck: QuickCheck | null;
  content: string;
}

export interface QuizQuestion {
  id: number | string;
  type: string;
  label?: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  /** Two-answer questions (GRE Sentence Equivalence) list both indices here. */
  correctIndices?: number[];
  explanation: string;
  words?: string[];
}

export interface QuizData {
  examId: string;
  examTitle: string;
  subtitle: string;
  timePerQuestionSeconds: number;
  passingScorePercentage: number;
  instructions: string[];
  week?: string;
  questions: QuizQuestion[];
}

export interface Spotlight {
  slug: string;
  title: string;
  exam: string;
  date: string;
  description: string;
  words: string[];
  content: string;
}

const contentRoot = path.join(process.cwd(), "src/content");
const wordsDirectory = path.join(contentRoot, "words");
const quizzesDirectory = path.join(contentRoot, "quizzes");
const spotlightsDirectory = path.join(contentRoot, "spotlights");
const featuredFile = path.join(contentRoot, "featured.json");

export const EXAMS = [
  { id: "gre", name: "GRE" },
  { id: "gmat", name: "GMAT" },
  { id: "ielts", name: "IELTS" },
  { id: "toefl", name: "TOEFL" },
  { id: "sat", name: "SAT" },
  { id: "pte", name: "PTE" },
] as const;

/** Maps a tag like "GRE Core" or "IELTS Academic Band 8+" to an exam id. */
export function examIdFromTag(tag: string): string | null {
  const t = tag.toUpperCase();
  const hit = EXAMS.find((e) => t.includes(e.name));
  return hit ? hit.id : null;
}

const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : v == null ? fallback : String(v));
const dateStr = (v: unknown, fallback: string): string =>
  v instanceof Date ? v.toISOString().slice(0, 10) : (str(v) || fallback).slice(0, 10);
const list = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => str(x)).filter(Boolean) : []);

function parseWord(fileName: string): WordItem {
  const fileContents = fs.readFileSync(path.join(wordsDirectory, fileName), "utf8");
  const { data, content } = matter(fileContents);
  const examples = list(data.examples);
  const qc = data.quickCheck;
  return {
    word: str(data.word),
    slug: str(data.slug) || fileName.replace(/\.md$/, ""),
    phonetic: str(data.phonetic),
    partOfSpeech: str(data.partOfSpeech, "adjective"),
    definitionSnippet: str(data.definitionSnippet),
    fullDefinition: str(data.fullDefinition) || str(data.definitionSnippet),
    examTags: list(data.examTags),
    dateAdded: dateStr(data.dateAdded, "2026-10-28"),
    inContext: str(data.inContext) || examples[0] || "",
    examples: examples.length ? examples : data.inContext ? [str(data.inContext)] : [],
    synonyms: list(data.synonyms),
    synonymNuance: str(data.synonymNuance),
    antonyms: list(data.antonyms),
    memoryTrick: {
      mnemonic: str(data.memoryTrick?.mnemonic),
      etymology: str(data.memoryTrick?.etymology),
    },
    examNote: str(data.examNote),
    quickCheck:
      qc && Array.isArray(qc.options) && qc.options.length
        ? { prompt: str(qc.prompt), options: list(qc.options), answerIndex: Number(qc.answerIndex) || 0, explanation: str(qc.explanation) }
        : null,
    content: content.trim(),
  };
}

// Read every word file once per build. With thousands of pages this keeps builds fast.
let wordCache: WordItem[] | null = null;
let wordIndex: Map<string, WordItem> | null = null;

export function getAllWords(): WordItem[] {
  if (wordCache) return wordCache;
  if (!fs.existsSync(wordsDirectory)) return [];
  const words = fs
    .readdirSync(wordsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map(parseWord)
    .filter((w) => w.word);
  words.sort((a, b) => (a.dateAdded < b.dateAdded ? 1 : a.dateAdded > b.dateAdded ? -1 : a.word.localeCompare(b.word)));
  wordCache = words;
  wordIndex = new Map(words.map((w) => [w.slug.toLowerCase(), w]));
  return words;
}

export function getRecentWords(limit: number = 5): WordItem[] {
  return getAllWords().slice(0, limit);
}

export function getWordBySlug(slug: string): WordItem | null {
  getAllWords();
  return wordIndex?.get(slug.toLowerCase()) || null;
}

/** Today's 5 words, chosen each night by the autopilot. Falls back to the newest words. */
export function getFeaturedWords(limit: number = 5): { date: string | null; words: WordItem[] } {
  try {
    if (fs.existsSync(featuredFile)) {
      const data = JSON.parse(fs.readFileSync(featuredFile, "utf8"));
      const slugs: string[] = Array.isArray(data.slugs) ? data.slugs : [];
      const words = slugs.map((s) => getWordBySlug(s)).filter((w): w is WordItem => !!w).slice(0, limit);
      if (words.length) return { date: str(data.date) || null, words };
    }
  } catch {
    /* fall through to newest words */
  }
  return { date: null, words: getRecentWords(limit) };
}

export function getWordsByLetter(letter: string): WordItem[] {
  const l = letter.toLowerCase();
  return getAllWords()
    .filter((w) => (/^[a-z]/.test(l) ? w.slug.toLowerCase().startsWith(l) : !/^[a-z]/.test(w.slug.toLowerCase())))
    .sort((a, b) => a.word.localeCompare(b.word));
}

export function getQuizData(examId: string): QuizData | null {
  const fullPath = path.join(quizzesDirectory, `${examId}-challenge.json`);
  if (!fs.existsSync(fullPath)) return null;
  return JSON.parse(fs.readFileSync(fullPath, "utf8")) as QuizData;
}

/** Correct option indices for a question, whether it uses correctIndex or correctIndices. */
export function correctAnswers(q: QuizQuestion): number[] {
  return Array.isArray(q.correctIndices) && q.correctIndices.length ? q.correctIndices.map(Number) : [Number(q.correctIndex)];
}

let spotlightCache: Spotlight[] | null = null;

export function getAllSpotlights(): Spotlight[] {
  if (spotlightCache) return spotlightCache;
  if (!fs.existsSync(spotlightsDirectory)) return [];
  const items = fs
    .readdirSync(spotlightsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const { data, content } = matter(fs.readFileSync(path.join(spotlightsDirectory, fileName), "utf8"));
      return {
        slug: fileName.replace(/\.md$/, ""),
        title: str(data.title),
        exam: str(data.exam).toUpperCase(),
        date: dateStr(data.date, ""),
        description: str(data.description),
        words: list(data.words),
        content: content.trim(),
      };
    })
    .filter((s) => s.title);
  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  spotlightCache = items;
  return items;
}

export function getSpotlight(slug: string): Spotlight | null {
  return getAllSpotlights().find((s) => s.slug === slug) || null;
}
