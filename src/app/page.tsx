import Link from "next/link";
import { getAllWords, getFeaturedWords } from "@/lib/content";
import { EXAM_CONFIG, SITE } from "@/config/site";
import Signup from "@/components/Signup";
import { MdInline } from "@/components/Markdown";
import { ArrowRight, BookOpen, Brain, CalendarCheck, ChevronRight, Clock, FileText, Layers, RotateCcw, Sparkles } from "lucide-react";

export default function HomePage() {
  const { words: featured } = getFeaturedWords(5);
  const total = getAllWords().length;

  return (
    <div className="space-y-16 pb-20">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-14 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-700/50">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-200 text-xs font-medium mb-7">
            5 words a day · 1 lesson for your exam · 1 quiz on Sunday
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Learn the words your exam tests.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200">Remember them on test day.</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Five new words every day. A lesson that shows them inside your exam&apos;s questions. A Sunday quiz that checks you remember them, and brings older words back before you forget. Free for GRE, GMAT, IELTS, TOEFL, SAT and PTE.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#exams" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold">
              Pick your exam <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#today" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-600 hover:bg-slate-800 font-bold text-slate-200">
              See today&apos;s 5 words
            </a>
          </div>
          <div className="mt-8 max-w-2xl mx-auto">
            <Signup dark />
          </div>

          {/* EXAM CARDS */}
          <div id="exams" className="scroll-mt-24 mt-12 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {EXAM_CONFIG.map((exam) => (
              <Link
                key={exam.id}
                href={exam.href}
                className={`group relative p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 ${exam.hoverBorder} hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${exam.badgeColor}`}>{exam.name}</span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${exam.accentDot}`}></span>
                      {exam.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{exam.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{exam.line}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                  <span>{exam.name} this week: words, lesson, quiz</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-400 text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2"><Sparkles className="w-4 h-4 text-blue-400" /><span>5 new words daily</span></div>
            <div className="flex items-center justify-center gap-2"><Layers className="w-4 h-4 text-emerald-400" /><span>Each exam in its own format</span></div>
            <div className="flex items-center justify-center gap-2"><Clock className="w-4 h-4 text-purple-400" /><span>Sunday quiz with explanations</span></div>
            <div className="flex items-center justify-center gap-2"><RotateCcw className="w-4 h-4 text-amber-400" /><span>Older words return after 3–4 weeks</span></div>
          </div>
        </div>
      </section>

      {/* TODAY'S WORDS */}
      <section id="today" className="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 font-bold mb-1">
              <Sparkles className="w-4 h-4" /> Today&apos;s 5 words
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Today&apos;s words</h2>
            <p className="mt-1 text-slate-600 text-sm max-w-xl">
              Learn these today. You&apos;ll meet them again in this week&apos;s lesson for your exam, and again in Sunday&apos;s quiz.
            </p>
          </div>
          <Link href="/words" className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group">
            Browse the full vault{total > 10 ? ` (${total.toLocaleString("en-IN")} words)` : ""}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item) => (
            <article key={item.slug} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {item.examTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.word}</h3>
                <div className="flex items-center gap-2 mt-0.5 mb-3">
                  <span className="text-xs font-mono text-slate-500">{item.phonetic}</span>
                  <span className="text-[11px] font-medium italic text-slate-400">• {item.partOfSpeech}</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-4"><MdInline text={item.definitionSnippet} /></p>
                {item.memoryTrick?.mnemonic && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-0.5 text-[11px] uppercase tracking-wider">Memory trick</span>
                    <p className="line-clamp-2"><MdInline text={item.memoryTrick.mnemonic} /></p>
                  </div>
                )}
              </div>
              <Link href={`/words/${item.slug}`} className="pt-4 border-t border-slate-100 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800">
                Examples, synonyms and a practice question <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}

          <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between border border-blue-800">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">This week&apos;s lessons</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                One lesson a day, Monday to Saturday, each putting this week&apos;s words inside one exam&apos;s questions.
              </p>
              <ul className="space-y-1 text-xs text-slate-300 font-mono mb-4">
                {EXAM_CONFIG.map((e) => (
                  <li key={e.id}>
                    {e.lessonDay}: {e.name}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/spotlights" className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-blue-50 transition-colors">
              Read the lessons <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">How it works</span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Why word lists don&apos;t stick, and what does</h2>
            <p className="mt-3 text-slate-600 text-base leading-relaxed">
              Reading a list feels productive, but most new words fade within days. Here you meet each word three times in a week, a different way each time, then get tested on it. A month later it comes back in the quiz, so it stays.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: 1, icon: <Sparkles className="w-5 h-5" />, color: "bg-blue-50 text-blue-700", title: "Learn · every day", body: "Five words with a plain definition, three real examples, the closest synonym and how it differs, and a memory trick." },
              { n: 2, icon: <Brain className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-700", title: "Use · your exam's day", body: "A lesson that puts the week's words inside your exam's own questions: Sentence Equivalence for GRE, Critical Reasoning for GMAT, collocations for IELTS, and so on." },
              { n: 3, icon: <CalendarCheck className="w-5 h-5" />, color: "bg-purple-50 text-purple-700", title: "Recall · Sunday", body: "A timed quiz in your exam's format. Your score is instant; explanations show you exactly what to fix." },
            ].map((c) => (
              <div key={c.n} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.color}`}>{c.icon}</div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{c.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VAULT PASS */}
      {SITE.vaultPassUrl && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8 sm:p-12 flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" /> Vault Pass
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold">Your weekly revision pack</h2>
              <p className="mt-3 text-slate-300">
                Every Sunday, a printable PDF for your exam: the week&apos;s words, the quiz plus bonus questions, and full answers. Delivered to your inbox.
              </p>
              <p className="mt-3 text-sm text-slate-400">₹199 for one month{SITE.vaultPassUrl6m ? ", or ₹999 for six months" : ""}. No auto-renewal.</p>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <a href={SITE.vaultPassUrl} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold hover:bg-blue-50">
                Get Vault Pass: ₹199
              </a>
              {SITE.vaultPassUrl6m && (
                <a href={SITE.vaultPassUrl6m} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-500 font-bold text-slate-200 hover:bg-slate-800">
                  6 months: ₹999
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* WHO WRITES THIS */}
      {SITE.authorName && (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-lg font-bold text-slate-900">Who writes this</h2>
          <p className="mt-2 text-slate-600 text-sm leading-relaxed">
            Written and checked by {SITE.authorName}
            {SITE.authorCredential ? `, ${SITE.authorCredential}` : ""}. Every word passes a dictionary check and an independent answer check before it goes live.
            {SITE.contactEmail && (
              <>
                {" "}Spot a mistake? Email <a className="text-blue-700 font-semibold" href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> and it&apos;s fixed within a day.
              </>
            )}
          </p>
        </section>
      )}
    </div>
  );
}
