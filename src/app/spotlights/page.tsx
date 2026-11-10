import type { Metadata } from "next";
import Link from "next/link";
import { getAllSpotlights } from "@/lib/content";
import { EXAM_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Exam Vocabulary Lessons: GRE, GMAT, IELTS, TOEFL, SAT, PTE | VerbalVaultPrep",
  description: "A new lesson every day from Monday to Saturday, one per exam, putting this week's words inside real exam questions.",
};

export default function SpotlightsIndex({ searchParams }: { searchParams?: { exam?: string } }) {
  const all = getAllSpotlights();
  const exam = (searchParams?.exam || "").toUpperCase();
  const shown = exam ? all.filter((s) => s.exam === exam) : all;
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Lessons</h1>
        <p className="mt-2 text-slate-600">One lesson a day, Monday to Saturday, each built on this week&apos;s words.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/spotlights" className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${!exam ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700"}`}>All</Link>
          {EXAM_CONFIG.map((e) => (
            <Link key={e.id} href={`/spotlights?exam=${e.name}`} className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${exam === e.name ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-700"}`}>
              {e.name} · {e.lessonDay}
            </Link>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          {shown.length === 0 && <p className="text-slate-600">The first lessons arrive this week.</p>}
          {shown.map((s) => (
            <Link key={s.slug} href={`/spotlights/${s.slug}`} className="block bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 transition-colors">
              <span className="text-xs font-mono font-bold text-blue-700">{s.exam} · {s.date}</span>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{s.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{s.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
