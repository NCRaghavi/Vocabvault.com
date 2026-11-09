import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface MemoryTrick {
  mnemonic: string;
  etymology: string;
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
  synonyms: string[];
  antonyms: string[];
  memoryTrick: MemoryTrick;
  content: string;
}

export interface QuizQuestion {
  id: number;
  type: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  examId: string;
  examTitle: string;
  subtitle: string;
  timePerQuestionSeconds: number;
  passingScorePercentage: number;
  instructions: string[];
  questions: QuizQuestion[];
}

const wordsDirectory = path.join(process.cwd(), "src/content/words");
const quizzesDirectory = path.join(process.cwd(), "src/content/quizzes");

export function getAllWords(): WordItem[] {
  if (!fs.existsSync(wordsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(wordsDirectory);
  const words: WordItem[] = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(wordsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        word: data.word || "",
        slug: data.slug || fileName.replace(/\.md$/, ""),
        phonetic: data.phonetic || "",
        partOfSpeech: data.partOfSpeech || "adjective",
        definitionSnippet: data.definitionSnippet || "",
        fullDefinition: data.fullDefinition || data.definitionSnippet || "",
        examTags: data.examTags || [],
        dateAdded: data.dateAdded || "2026-10-28",
        inContext: data.inContext || "",
        synonyms: data.synonyms || [],
        antonyms: data.antonyms || [],
        memoryTrick: {
          mnemonic: data.memoryTrick?.mnemonic || "",
          etymology: data.memoryTrick?.etymology || "",
        },
        content: content.trim(),
      };
    });

  // Sort by dateAdded descending
  return words.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
}

export function getRecentWords(limit: number = 5): WordItem[] {
  return getAllWords().slice(0, limit);
}

export function getWordBySlug(slug: string): WordItem | null {
  const words = getAllWords();
  const word = words.find((w) => w.slug.toLowerCase() === slug.toLowerCase());
  return word || null;
}

export function getQuizData(examId: string): QuizData | null {
  const fullPath = path.join(quizzesDirectory, `${examId}-challenge.json`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(fileContents) as QuizData;
}
