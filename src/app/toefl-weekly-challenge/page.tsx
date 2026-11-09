import type { Metadata } from "next";
import Link from "next/link";
import { getQuizData } from "@/lib/content";
import CbtQuizEngine from "@/components/CbtQuizEngine";
import AdSlot from "@/components/AdSlot";
import { Award, ArrowLeft, BookOpen, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "TOEFL iBT Academic Verbal Challenge | VerbalVaultPrep",
  description:
    "Timed CBT simulation for TOEFL iBT Academic Reading Vocabulary in Context. 35-second timer per question, university-level lexical analysis, and instant scoring.",
};

export default function ToeflWeeklyChallengePage() {
  const quizData = getQuizData("toefl");

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
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-600 font-semibold">
              TOEFL iBT Academic Reading Simulation • CBT Session Active
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
            <BookOpen className="w-5 h-5 text-teal-600" />
            TOEFL iBT Reading Vocabulary Strategy Guide
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            TOEFL iBT Academic Reading presents university-level passages from natural science, history, and social science. Questions test high-tier Tier 2 academic vocabulary in context. Notice that the best answer must preserve both the exact semantic denotation and the author&apos;s objective scholarly tone.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
            <span>• Substitute candidate words back into passage context</span>
            <span>• Eliminate overly emotive or colloquial distractors</span>
            <span>• Target 30-35s per vocabulary in context question</span>
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
