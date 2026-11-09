import type { Metadata } from "next";
import Link from "next/link";
import { getQuizData } from "@/lib/content";
import CbtQuizEngine from "@/components/CbtQuizEngine";
import AdSlot from "@/components/AdSlot";
import { Award, ArrowLeft, Globe2, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "PTE Academic Reading & Verbal Sprint | VerbalVaultPrep",
  description:
    "Timed CBT simulation for Pearson Test of English (PTE Academic) Reading: Fill in the Blanks & Collocations. 40-second countdown and benchmark 79+ scoring analysis.",
};

export default function PteWeeklyChallengePage() {
  const quizData = getQuizData("pte");

  if (!quizData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Quiz Data Not Found</h1>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation & header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-600 font-semibold">
              Pearson Test of English (PTE Academic) • CBT Diagnostic Active
            </span>
          </div>
        </div>

        {/* Top whitespace & leaderboard ad */}
        <div className="mb-10">
          <AdSlot type="leaderboard" />
        </div>

        {/* The Centered UI Card housing the custom JavaScript Quiz Engine */}
        <div className="my-8">
          <CbtQuizEngine quizData={quizData} />
        </div>

        {/* Post-quiz guidance & Test-Prep Strategy for International Students */}
        <div className="mt-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-3xl mx-auto">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-rose-600" />
            PTE Academic Reading Strategy Guide
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The Pearson Test of English (PTE Academic) heavily weights Reading &amp; Writing: Fill in the Blanks. These items test natural academic collocations, part-of-speech agreement, and precise lexical shades of meaning under intense AI scoring algorithms. Achieving a 79+ requires lightning-fast recognition of formal academic registers.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
            <span>• Master high-frequency academic collocations</span>
            <span>• Verify syntactic prepositions (e.g., &quot;concomitant with&quot;)</span>
            <span>• Allocate 35-40s per blank slot</span>
          </div>
        </div>

        {/* Bottom Ad Placement */}
        <div className="mt-10">
          <AdSlot type="footer" />
        </div>
      </div>
    </div>
  );
}
