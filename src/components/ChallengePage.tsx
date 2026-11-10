import Link from "next/link";
import { getQuizData, getAllSpotlights, getWeekWords } from "@/lib/content";
import { examById } from "@/config/site";
import CbtQuizEngine from "@/components/CbtQuizEngine";
import Markdown, { MdInline } from "@/components/Markdown";
import Signup from "@/components/Signup";
import AdSlot from "@/components/AdSlot";
import { ArrowLeft, ArrowRight, BookOpen, CalendarCheck, Sparkles } from "lucide-react";

/**
 * One exam's weekly hub, in learning order:
 * 1. this week's words → 2. this week's lesson (in full) → 3. the Sunday quiz → past lessons.
 */
export default function ChallengePage({ examId }: { examId: string }) {
  const exam = examById(examId)!;
  const quizData = getQuizData(examId);
  const lessons = getAllSpotlights().filter((s) => s.exam === exam.name);
  const lesson = lessons[0];
  const lessonIsCurrent = lesson && Date.now() - Date.parse(lesson.date) < 7 * 86400000;
  const words = getWeekWords(exam.name, 10);

  const step = (n: number, label: string) => (
    <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-700">
      <span className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center text-[11px]">{n}</span>
      {label}
    </span>
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to homepage</span>
        </Link>

        <header className="mt-6 text-center">
          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${exam.badgeColor}`}>{exam.name}</span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{exam.name} this week</h1>
          <p className="mt-2 text-slate-600 max-w-2xl mx-auto">
            Learn this week&apos;s words, see them in a {exam.name} lesson every {exam.lessonDay}, then test yourself in the Sunday quiz.
          </p>
          <nav aria-label="On this page" className="mt-5 flex flex-wrap justify-center gap-2 text-sm font-semibold">
            <a href="#words" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300">1 · Words</a>
            <a href="#lesson" className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-300">2 · Lesson</a>
            <a href="#quiz" className="px-3 py-1.5 rounded-lg bg-blue-700 text-white hover:bg-blue-800">3 · Sunday quiz</a>
          </nav>
        </header>

        <AdSlot type="leaderboard" className="mt-8" />

        {/* 1. WORDS */}
        <section id="words" className="scroll-mt-28 mt-10">
          {step(1, "This week's words")}
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Learn these first</h2>
          <p className="text-sm text-slate-600 mt-1">They come up in this week&apos;s lesson and again in Sunday&apos;s quiz.</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {words.map((w) => (
              <Link key={w.slug} href={`/words/${w.slug}`} className="group bg-white rounded-2xl border border-slate-200 p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-bold text-slate-900 group-hover:text-blue-700">{w.word}</span>
                  <span className="text-[11px] italic text-slate-400">{w.partOfSpeech}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                  <MdInline text={w.definitionSnippet} />
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 2. LESSON */}
        <section id="lesson" className="scroll-mt-28 mt-12">
          {step(2, lessonIsCurrent ? `This week's lesson · ${exam.lessonDay}` : `${exam.name} lesson · every ${exam.lessonDay}`)}
          {lesson ? (
            <article className="mt-3 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10">
              <p className="text-xs font-mono text-slate-500">{lessonIsCurrent ? lesson.date : `Latest lesson · ${lesson.date}`}</p>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{lesson.title}</h2>
              {lesson.description && <p className="mt-2 text-slate-600">{lesson.description}</p>}
              <div className="mt-4 border-t border-slate-100 pt-2">
                <Markdown source={lesson.content} />
              </div>
            </article>
          ) : (
            <div className="mt-3 bg-white rounded-3xl border border-dashed border-slate-300 p-8 text-center">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto" />
              <h2 className="mt-3 text-xl font-bold text-slate-900">This week&apos;s {exam.name} lesson arrives on {exam.lessonDay}</h2>
              <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">{exam.line}</p>
            </div>
          )}
        </section>

        {/* 3. QUIZ */}
        <section id="quiz" className="scroll-mt-28 mt-12">
          {step(3, "Sunday quiz")}
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">Will you remember them?</h2>
          <p className="text-sm text-slate-600 mt-1">Real {exam.name} question format, timed. Your score appears the moment you finish.</p>
          <div className="mt-4">
            {quizData ? (
              <CbtQuizEngine quizData={quizData} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
                <CalendarCheck className="w-8 h-8 text-blue-600 mx-auto" />
                <h3 className="mt-3 text-xl font-bold">This week&apos;s quiz goes live on Sunday morning</h3>
              </div>
            )}
          </div>
          <div className="mt-6 bg-white rounded-3xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> {exam.guideTitle}
            </h3>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed">{exam.guide}</p>
          </div>
        </section>

        {/* PAST LESSONS */}
        {lessons.length > 1 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-slate-900">Earlier {exam.name} lessons</h2>
            <div className="mt-3 space-y-2">
              {lessons.slice(1, 7).map((s) => (
                <Link key={s.slug} href={`/spotlights/${s.slug}`} className="flex items-center justify-between gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3 hover:border-blue-300">
                  <span>
                    <span className="text-xs font-mono text-slate-500">{s.date}</span>
                    <span className="block font-semibold text-slate-900">{s.title}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </Link>
              ))}
            </div>
            <Link href={`/spotlights?exam=${exam.name}`} className="mt-3 inline-block text-sm font-semibold text-blue-700">
              All {exam.name} lessons →
            </Link>
          </section>
        )}

        <div className="mt-12">
          <Signup exam={exam.name} />
        </div>

        <AdSlot type="footer" className="mt-10" />
      </div>
    </div>
  );
}
