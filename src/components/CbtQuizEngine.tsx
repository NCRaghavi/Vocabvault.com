"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { QuizData, QuizQuestion } from "@/lib/content";
import { SITE } from "@/config/site";
import { Clock, RotateCcw, HelpCircle, Play, Zap, Lock, Send } from "lucide-react";

interface CbtQuizEngineProps {
  quizData: QuizData;
}

type Phase = "start" | "active" | "done";
const UNLOCK_KEY = "vvp_unlocked";
const LETTERS = "ABCDEF";

const answersOf = (q: QuizQuestion): number[] =>
  Array.isArray(q.correctIndices) && q.correctIndices.length ? q.correctIndices.map(Number) : [Number(q.correctIndex)];
const sameSet = (a: number[], b: number[]) => a.length === b.length && [...a].sort().join(",") === [...b].sort().join(",");
const fmt = (s: number) => `${String(Math.floor(Math.max(0, s) / 60)).padStart(2, "0")}:${String(Math.max(0, s) % 60).padStart(2, "0")}`;
const examName = (id: string) => id.toUpperCase();

function readUnlocked(): boolean {
  try {
    return window.localStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export async function postSubscribe(payload: Record<string, string>) {
  if (!SITE.subscribeUrl) return;
  try {
    // Apps Script web apps don't send CORS headers: no-cors + text/plain is the reliable way to post.
    await fetch(SITE.subscribeUrl, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
  } catch {
    /* never block the student on a network hiccup */
  }
}

export default function CbtQuizEngine({ quizData }: CbtQuizEngineProps) {
  const questions = quizData.questions;
  const secs = quizData.timePerQuestionSeconds || 45;
  const exam = examName(quizData.examId);

  const [phase, setPhase] = useState<Phase>("start");
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<number[][]>([]);
  const [left, setLeft] = useState(secs);
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const picksRef = useRef<number[][]>([]);

  useEffect(() => setUnlocked(readUnlocked()), []);

  const advance = useCallback(() => {
    setIndex((i) => {
      if (i < questions.length - 1) {
        setLeft(secs);
        return i + 1;
      }
      setPhase("done");
      return i;
    });
  }, [questions.length, secs]);

  // Countdown: one tick a second; auto-advance when time runs out.
  useEffect(() => {
    if (phase !== "active") return;
    if (left <= 0) {
      advance();
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, left, advance]);

  const start = () => {
    picksRef.current = questions.map(() => []);
    setPicks(picksRef.current);
    setIndex(0);
    setLeft(secs);
    setPhase("active");
  };

  const toggle = (k: number) => {
    const need = answersOf(questions[index]).length;
    const cur = [...(picksRef.current[index] || [])];
    const at = cur.indexOf(k);
    if (at >= 0) cur.splice(at, 1);
    else if (need === 1) cur.splice(0, cur.length, k);
    else if (cur.length < need) cur.push(k);
    else {
      cur.shift();
      cur.push(k);
    }
    picksRef.current = picksRef.current.map((p, i) => (i === index ? cur : p));
    setPicks(picksRef.current);
  };

  const results = questions.map((q, i) => sameSet(picks[i] || [], answersOf(q)));
  const score = results.filter(Boolean).length;
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      setMsg("Please enter a valid email.");
      return;
    }
    setSending(true);
    await postSubscribe({ type: "subscribe", email: v, exam, score: `${score}/${questions.length}`, source: `quiz-${quizData.week || ""}` });
    try {
      window.localStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      /* private mode: unlock for this visit only */
    }
    setUnlocked(true);
    setSending(false);
  };

  const q = questions[index];
  const need = q ? answersOf(q).length : 1;
  const chosen = picks[index] || [];

  return (
    <div className="w-full">
      <div id="cbt-quiz-card" className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 transition-all">
        {phase === "start" && (
          <div className="space-y-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 mb-2 shadow-inner">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {quizData.week ? `Week of ${quizData.week}` : "This week's quiz"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">{quizData.examTitle}</h2>
              <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">{quizData.subtitle}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-mono text-slate-400 block">Questions</span>
                <span className="text-lg font-bold text-slate-800">{questions.length}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-mono text-slate-400 block">Per question</span>
                <span className="text-lg font-bold text-slate-800">{secs}s</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl">
                <span className="text-xs font-mono text-slate-400 block">About</span>
                <span className="text-lg font-bold text-slate-800">{Math.ceil((questions.length * secs) / 60)} min</span>
              </div>
            </div>
            {quizData.instructions?.length > 0 && (
              <ul className="bg-slate-50 rounded-2xl p-4 text-left space-y-1 border border-slate-100 text-xs text-slate-600 list-disc pl-8">
                {quizData.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={start}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base shadow-lg shadow-blue-700/20 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Start the quiz</span>
            </button>
          </div>
        )}

        {phase === "active" && q && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="text-xs sm:text-sm font-medium text-slate-500 font-mono">
                Question <span className="font-bold text-slate-900">{index + 1}</span> of <span className="font-bold text-slate-900">{questions.length}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
                <Clock className="w-4 h-4 text-slate-500" />
                <div aria-live="polite" className={`font-mono text-lg font-bold ${left <= 10 ? "text-rose-600" : "text-blue-700"}`}>
                  {fmt(left)}
                </div>
              </div>
            </div>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden -mt-3">
              <div className="h-full bg-blue-600 transition-all" style={{ width: `${(index / questions.length) * 100}%` }} />
            </div>
            <div className="py-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 block mb-2">{q.label || q.type}</span>
              <p className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed font-serif whitespace-pre-line">{q.prompt}</p>
              {need === 2 && <p className="mt-3 text-xs text-slate-500">Select exactly two answers that give the sentence the same meaning.</p>}
            </div>
            <div className="space-y-3">
              {q.options.map((opt, k) => {
                const on = chosen.includes(k);
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(k)}
                    className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                      on ? "border-2 border-blue-600 bg-blue-50/70 shadow-sm" : "border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300"
                    }`}
                  >
                    <span className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${on ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                      {LETTERS.charAt(k)}
                    </span>
                    <span className="text-sm sm:text-base font-medium text-slate-800">{opt}</span>
                  </button>
                );
              })}
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">Moves on when time runs out</span>
              <button
                type="button"
                disabled={chosen.length !== need}
                onClick={advance}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                  chosen.length === need ? "bg-blue-700 hover:bg-blue-800 text-white shadow-md cursor-pointer" : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {index === questions.length - 1 ? "See my score" : "Next question →"}
              </button>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="space-y-6">
            <div className="text-center py-2">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${pct >= 70 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                <span className="text-2xl font-extrabold font-mono">{pct}%</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {score} of {questions.length} correct
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {pct >= 80 ? "Strong. These words are yours now." : pct >= 50 ? "Solid base. The misses below show exactly what to fix." : "Good that you found this now. Review the explanations, then try next Sunday's quiz."}
              </p>
            </div>

            {!unlocked && (
              <form onSubmit={unlock} className="rounded-2xl border border-blue-200 bg-blue-50 p-5 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Lock className="w-4 h-4 text-blue-700" /> Unlock all {questions.length} explanations
                </div>
                <p className="text-sm text-slate-600">
                  Enter your email to see why each answer is right. You&apos;ll also get next Sunday&apos;s {exam} quiz and the week&apos;s words, once a week. Unsubscribe in one click.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    aria-label="Email address"
                    className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                  <button type="submit" disabled={sending} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold px-5 py-3 text-sm cursor-pointer">
                    <Send className="w-4 h-4" /> Show explanations
                  </button>
                </div>
                {msg && <p className="text-xs text-rose-700">{msg}</p>}
              </form>
            )}

            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" /> Question by question
              </h4>
              <div className="space-y-3">
                {questions.map((qq, i) => {
                  const ok = results[i];
                  const mine = picks[i] || [];
                  const key = answersOf(qq);
                  const word = qq.words?.[0];
                  return (
                    <div key={qq.id ?? i} className={`p-5 rounded-2xl border space-y-2 text-left ${ok ? "border-emerald-200 bg-emerald-50/40" : "border-rose-200 bg-rose-50/40"}`}>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-800">
                          Q{i + 1} · {qq.label || qq.type}
                        </span>
                        <span className={`font-bold ${ok ? "text-emerald-700" : "text-rose-700"}`}>{ok ? "✓ Correct" : "✗ Missed"}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-900 leading-snug whitespace-pre-line">{qq.prompt}</p>
                      <div className={unlocked ? "" : "blur-sm select-none pointer-events-none"} aria-hidden={!unlocked}>
                        <p className="text-xs text-slate-600">
                          Your answer: <span className="font-semibold">{mine.length ? mine.map((m) => LETTERS.charAt(m)).join(" & ") : "no answer (time ran out)"}</span>
                          {" · "}Correct: <span className="font-semibold text-emerald-800">{key.map((k) => `${LETTERS.charAt(k)}) ${qq.options[k]}`).join(" & ")}</span>
                        </p>
                        <div className="mt-2 text-xs text-slate-600 bg-white/70 p-3 rounded-xl leading-relaxed">
                          {qq.explanation}
                          {word && (
                            <>
                              {" "}
                              <Link href={`/words/${word.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="font-semibold text-blue-700 hover:underline">
                                Revise “{word}” →
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-center">
              {SITE.vaultPassUrl && (
                <a href={SITE.vaultPassUrl} className="inline-flex items-center justify-center py-3 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm">
                  Get the {exam} revision PDF: Vault Pass ₹199
                </a>
              )}
              {SITE.telegramUrl && (
                <a href={SITE.telegramUrl} className="inline-flex items-center justify-center py-3 px-6 rounded-xl border border-slate-300 hover:bg-slate-50 font-bold text-sm text-slate-800">
                  5 words a day on Telegram
                </a>
              )}
              <button type="button" onClick={() => setPhase("start")} className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm cursor-pointer">
                <RotateCcw className="w-4 h-4" /> Retake
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
