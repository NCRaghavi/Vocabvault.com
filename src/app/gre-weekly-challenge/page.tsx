import type { Metadata } from "next";
import Link from "next/link";
import { getQuizData } from "@/lib/content";
import CbtQuizEngine from "@/components/CbtQuizEngine";
import AdSlot from "@/components/AdSlot";
import { Award, ArrowLeft, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "GRE Master CBT Challenge | VerbalVaultPrep",
  description:
    "Timed computer-based test simulation for GRE Text Completion and Sentence Equivalence. 45-second per-question countdown, real-time score summary, and lexical rationales.",
};

export default function GreWeeklyChallengePage() {
  const quizData = getQuizData("gre");

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
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono text-slate-600 font-semibold">
              GRE General Test Simulation • CBT Session Active
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
            <Award className="w-5 h-5 text-blue-600" />
            ETS GRE Verbal Strategy Guide
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            GRE Text Completion items are engineered to test nuanced word connotations and tone shifts indicated by transition words (e.g., <em>nevertheless</em>, <em>paradoxically</em>, <em>whereas</em>). Time management is paramount: high scorers average 35 to 45 seconds per single-blank item.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-mono text-slate-500">
            <span>• Negative contrast signals</span>
            <span>• Synonymous pair identification</span>
            <span>• Root etymology triage</span>
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
