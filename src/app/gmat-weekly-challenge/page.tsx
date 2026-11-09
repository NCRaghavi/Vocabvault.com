import type { Metadata } from "next";
import Link from "next/link";
import { getQuizData } from "@/lib/content";
import CbtQuizEngine from "@/components/CbtQuizEngine";
import AdSlot from "@/components/AdSlot";
import { Award, ArrowLeft, Brain, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "GMAT Focus Verbal Reasoning Challenge | VerbalVaultPrep",
  description:
    "Timed CBT simulation for GMAT Critical Reasoning and Reading Comprehension vocabulary. 45-second countdown per item, assumption testing, and lexical flaw analysis.",
};

export default function GmatWeeklyChallengePage() {
  const quizData = getQuizData("gmat");

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
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-600 font-semibold">
              GMAT Focus Edition Simulation • Critical Reasoning Active
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
            <Brain className="w-5 h-5 text-violet-600" />
            GMAT Focus Verbal Strategy Guide
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            In the GMAT Focus Edition, verbal questions evaluate logical rigor and assumption vulnerability rather than pure memorization. Key vocabulary terms such as <em>tacit</em>, <em>fallacious</em>, <em>substantiate</em>, and <em>equivocal</em> serve as vital markers of argument validity in Critical Reasoning.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
            <span>• Identify unstated premises</span>
            <span>• Isolate equivocal terminology</span>
            <span>• Target 45s per Critical Reasoning item</span>
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
