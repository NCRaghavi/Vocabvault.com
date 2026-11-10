import type { Metadata } from "next";
import Link from "next/link";
import { getAllWords } from "@/lib/content";
import LetterBar from "@/components/LetterBar";
import WordSearch from "@/components/WordSearch";
import AdSlot from "@/components/AdSlot";
import { BookOpen, ArrowRight, Search, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Vocabulary Vault: GRE, GMAT, IELTS, TOEFL, SAT & PTE Words | VerbalVaultPrep",
  description:
    "Every word with a plain definition, three examples, synonyms and a memory trick. Browse A to Z or start with the newest words.",
  alternates: { canonical: "https://verbalvaultprep.com/words" },
};

export default function WordsIndexPage() {
  const all = getAllWords();
  const words = all.slice(0, 60);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {all.length.toLocaleString("en-IN")} words
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            The Vocabulary Vault
          </h1>
          <p className="mt-3 text-slate-600 text-base">
            Every word with a plain definition, three examples, synonyms and a memory trick. Browse A to Z, or start with the newest words below.
          </p>
          <div className="mt-6"><WordSearch /></div>
          <LetterBar />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Newest words</h2>

        <AdSlot type="leaderboard" className="mb-10" />

        {/* Word Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((item) => (
            <Link
              key={item.slug}
              href={`/words/${item.slug}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.examTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.word}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {item.phonetic}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mt-2 line-clamp-2">
                  {item.definitionSnippet}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold">
                <span>View Full Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
