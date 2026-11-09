import type { Metadata } from "next";
import Link from "next/link";
import { getQuizData } from "@/lib/content";
import CbtQuizEngine from "@/components/CbtQuizEngine";
import AdSlot from "@/components/AdSlot";
import { Award, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "IELTS Academic Verbal Challenge | VerbalVaultPrep",
  description:
    "Timed Academic Reading & Lexical Resource simulation for international students targeting IELTS Band 8.0-9.0.",
};

export default function IeltsWeeklyChallengePage() {
  const quizData = getQuizData("ielts");

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
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>
          <span className="text-xs font-mono text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            IELTS Academic Band 8+ Focus
          </span>
        </div>

        <div className="mb-10">
          <AdSlot type="leaderboard" />
        </div>

        <div className="my-8">
          <CbtQuizEngine quizData={quizData} />
        </div>

        <div className="mt-10">
          <AdSlot type="footer" />
        </div>
      </div>
    </div>
  );
}
