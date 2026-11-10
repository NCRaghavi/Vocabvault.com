import Link from "next/link";
import { getQuizData, getAllSpotlights } from "@/lib/content";
import { examById } from "@/config/site";
import CbtQuizEngine from "@/components/CbtQuizEngine";
import Signup from "@/components/Signup";
import AdSlot from "@/components/AdSlot";
import { Award, ArrowLeft, BookOpen } from "lucide-react";

/** Shared layout for the six Sunday quiz pages. */
export default function ChallengePage({ examId }: { examId: string }) {
  const exam = examById(examId)!;
  const quizData = getQuizData(examId);
  const lesson = getAllSpotlights().find((s) => s.exam === exam.name);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to homepage</span>
          </Link>
          <span className="text-xs font-mono text-slate-600 font-semibold">New quiz every Sunday · lesson every {exam.lessonDay}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">Sunday {exam.name} Quiz</h1>
        <p className="mt-2 text-center text-slate-600 max-w-2xl mx-auto">
          Questions on this week&apos;s words, in real {exam.name} format. Your score appears the moment you finish.
        </p>

        <AdSlot type="leaderboard" className="mt-8" />

        <div className="my-8">
          {quizData ? (
            <CbtQuizEngine quizData={quizData} />
          ) : (
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-10 text-center">
              <h2 className="text-xl font-bold">This week&apos;s quiz is being prepared</h2>
              <p className="text-slate-600 mt-2">It goes live on Sunday morning.</p>
            </div>
          )}
        </div>

        {lesson && (
          <Link href={`/spotlights/${lesson.slug}`} className="block max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 hover:border-blue-300 transition-colors">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> This week&apos;s {exam.name} lesson
            </span>
            <p className="mt-2 text-lg font-bold text-slate-900">{lesson.title}</p>
            <p className="text-sm text-slate-600 mt-1">{lesson.description}</p>
          </Link>
        )}

        <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            {exam.guideTitle}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{exam.guide}</p>
        </div>

        <div className="mt-8 max-w-3xl mx-auto">
          <Signup exam={exam.name} />
        </div>

        <AdSlot type="footer" className="mt-10" />
      </div>
    </div>
  );
}
