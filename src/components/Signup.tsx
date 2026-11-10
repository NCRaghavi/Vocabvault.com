"use client";

import { useState } from "react";
import { postSubscribe } from "@/components/CbtQuizEngine";

const EXAMS = ["GRE", "GMAT", "IELTS", "TOEFL", "SAT", "PTE"];

interface SignupProps {
  /** Preselects the exam on an exam's own page. */
  exam?: string;
  dark?: boolean;
}

export default function Signup({ exam = "", dark = false }: SignupProps) {
  const [choice, setChoice] = useState(exam.toUpperCase());
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!choice) return setMsg("Pick your exam so we send the right quiz.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setMsg("Please enter a valid email.");
    setSending(true);
    await postSubscribe({ type: "subscribe", email: email.trim(), exam: choice, source: "signup" });
    setDone(true);
  };

  const box = dark ? "bg-slate-800/80 border-slate-700 text-white" : "bg-blue-50 border-blue-200 text-slate-900";
  const sub = dark ? "text-slate-300" : "text-slate-600";

  if (done) {
    return (
      <div className={`rounded-2xl border p-5 text-left ${box}`}>
        <p className="font-bold">You&apos;re in.</p>
        <p className={`text-sm mt-1 ${sub}`}>Your first {choice} quiz arrives on Sunday morning.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`rounded-2xl border p-5 text-left ${box}`}>
      <p className="font-bold">Get your exam&apos;s Sunday quiz, free</p>
      <p className={`text-sm mt-1 ${sub}`}>One email a week: your exam&apos;s quiz, its lesson, and the week&apos;s words.</p>
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <select
          value={choice}
          onChange={(e) => setChoice(e.target.value)}
          aria-label="Your exam"
          className="rounded-xl border border-slate-300 bg-white text-slate-900 px-3 py-3 text-base"
        >
          <option value="">My exam…</option>
          {EXAMS.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          className="flex-1 rounded-xl border border-slate-300 bg-white text-slate-900 px-4 py-3 text-base"
        />
        <button type="submit" disabled={sending} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 text-sm cursor-pointer">
          Send me the quiz
        </button>
      </div>
      {msg && <p className="mt-2 text-xs text-rose-500">{msg}</p>}
    </form>
  );
}
