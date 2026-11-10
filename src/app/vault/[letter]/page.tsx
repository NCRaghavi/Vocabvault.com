import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWordsByLetter } from "@/lib/content";
import LetterBar from "@/components/LetterBar";

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");

export function generateStaticParams() {
  return LETTERS.map((letter) => ({ letter }));
}

export function generateMetadata({ params }: { params: { letter: string } }): Metadata {
  const L = params.letter.toUpperCase();
  return {
    title: `Vocabulary starting with ${L}: meanings, examples, memory tricks | VerbalVaultPrep`,
    description: `Every word in the VerbalVaultPrep vault starting with ${L}, with definitions for GRE, GMAT, IELTS, TOEFL, SAT and PTE.`,
  };
}

export default function VaultLetterPage({ params }: { params: { letter: string } }) {
  const letter = params.letter.toLowerCase();
  if (!LETTERS.includes(letter)) notFound();
  const words = getWordsByLetter(letter);
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Words starting with {letter.toUpperCase()}</h1>
        <p className="mt-2 text-slate-600">{words.length} word{words.length === 1 ? "" : "s"} in the vault.</p>
        <LetterBar active={letter} />
        <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {words.map((w) => (
            <li key={w.slug}>
              <Link href={`/words/${w.slug}`} className="group">
                <span className="font-bold text-slate-900 group-hover:text-blue-700">{w.word}</span>
                <span className="text-sm text-slate-500"> · {w.definitionSnippet}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
