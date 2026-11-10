import type { Metadata } from "next";
import Link from "next/link";
import { MyWordsList } from "@/components/MyWords";
import { EXAM_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "My words: your revision list | VerbalVaultPrep",
  description: "Words you missed in quizzes or saved, kept in this browser so you can revise them before test day.",
  robots: { index: false },
};

export default function MyWordsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My words</h1>
        <p className="mt-2 text-slate-600">
          Your revision list. Open a word, revise it, and tap “I know it now” when it sticks. The list lives in this browser, so use the same phone or laptop each time.
        </p>
        <div className="mt-8">
          <MyWordsList />
        </div>
        <div className="mt-10 rounded-2xl bg-white border border-slate-200 p-5">
          <p className="font-bold text-slate-900">Test yourself again</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAM_CONFIG.map((e) => (
              <Link key={e.id} href={`${e.href}#quiz`} className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200">
                {e.name} quiz
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
