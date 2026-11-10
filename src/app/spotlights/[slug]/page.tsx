import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllSpotlights, getSpotlight, getWordBySlug } from "@/lib/content";
import { EXAM_CONFIG } from "@/config/site";
import Markdown from "@/components/Markdown";
import Signup from "@/components/Signup";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function generateStaticParams() {
  return getAllSpotlights().map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getSpotlight(params.slug);
  if (!s) return { title: "Lesson not found | VerbalVaultPrep" };
  return {
    title: `${s.title} | ${s.exam} Lesson | VerbalVaultPrep`,
    description: s.description,
    alternates: { canonical: `https://verbalvaultprep.com/spotlights/${s.slug}` },
    openGraph: { title: s.title, description: s.description, type: "article" },
  };
}

export default function SpotlightPage({ params }: { params: { slug: string } }) {
  const s = getSpotlight(params.slug);
  if (!s) notFound();
  const exam = EXAM_CONFIG.find((e) => e.name === s.exam);
  const words = s.words.map((w) => getWordBySlug(w.toLowerCase().replace(/[^a-z0-9]+/g, "-"))).filter((w) => !!w);
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href={`/spotlights?exam=${s.exam}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600">
          <ArrowLeft className="w-3.5 h-3.5" /> All {s.exam} lessons
        </Link>
        <p className="mt-6 text-xs font-mono font-bold text-blue-700">{s.exam} lesson · {s.date}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{s.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{s.description}</p>
        {words.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {words.map((w) => (
              <Link key={w!.slug} href={`/words/${w!.slug}`} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-100 hover:bg-indigo-100">
                {w!.word}
              </Link>
            ))}
          </div>
        )}
        <div className="mt-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10">
          <Markdown source={s.content} />
        </div>
        {exam && (
          <Link href={`${exam.href}#quiz`} className="mt-8 flex items-center justify-between rounded-2xl bg-blue-700 hover:bg-blue-800 text-white p-6">
            <span>
              <span className="block text-sm text-blue-200">Sunday</span>
              <span className="text-lg font-bold">Test these words in the {exam.name} quiz</span>
            </span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}
        <div className="mt-8">
          <Signup exam={s.exam} />
        </div>
      </article>
    </div>
  );
}
