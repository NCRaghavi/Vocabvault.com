import Link from "next/link";
import { getRecentWords } from "@/lib/content";
import {
  Award,
  ArrowRight,
  Clock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Brain,
  Globe2,
  ChevronRight,
  TrendingUp,
  FileText,
  Zap,
  GraduationCap
} from "lucide-react";

export default function HomePage() {
  // Dynamically load the 5 most recent vocabulary items from Markdown files
  const recentWords = getRecentWords(5);

  const examList = [
    {
      id: "gre",
      name: "GRE",
      title: "GRE Verbal Master",
      tag: "ETS General Test",
      href: "/gre-weekly-challenge",
      badgeColor: "bg-blue-600 text-white",
      hoverBorder: "hover:border-blue-400",
      accentDot: "bg-blue-400",
      desc: "Text Completion & Sentence Equivalence",
    },
    {
      id: "gmat",
      name: "GMAT",
      title: "GMAT Focus Verbal",
      tag: "GMAC Focus Edition",
      href: "/gmat-weekly-challenge",
      badgeColor: "bg-purple-600 text-white",
      hoverBorder: "hover:border-purple-400",
      accentDot: "bg-purple-400",
      desc: "Critical Reasoning & Fallacy Testing",
    },
    {
      id: "ielts",
      name: "IELTS",
      title: "IELTS Band 8+ Verbal",
      tag: "Academic Reading",
      href: "/ielts-weekly-challenge",
      badgeColor: "bg-emerald-600 text-white",
      hoverBorder: "hover:border-emerald-400",
      accentDot: "bg-emerald-400",
      desc: "Lexical Resource & Contextual Collocations",
    },
    {
      id: "toefl",
      name: "TOEFL",
      title: "TOEFL iBT Academic",
      tag: "ETS University Reading",
      href: "/toefl-weekly-challenge",
      badgeColor: "bg-teal-600 text-white",
      hoverBorder: "hover:border-teal-400",
      accentDot: "bg-teal-400",
      desc: "Vocabulary in Context & Inferences",
    },
    {
      id: "sat",
      name: "SAT",
      title: "Digital SAT Sprint",
      tag: "College Board Digital",
      href: "/sat-weekly-challenge",
      badgeColor: "bg-amber-600 text-white",
      hoverBorder: "hover:border-amber-400",
      accentDot: "bg-amber-400",
      desc: "Words in Context & Rhetorical Logic",
    },
    {
      id: "pte",
      name: "PTE",
      title: "Pearson Test (PTE)",
      tag: "PTE Academic Reading",
      href: "/pte-weekly-challenge",
      badgeColor: "bg-rose-600 text-white",
      hoverBorder: "hover:border-rose-400",
      accentDot: "bg-rose-400",
      desc: "Reading: Fill in the Blanks & Semantics",
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* =========================================
          HERO SECTION: The Weekly Master CBT Challenge
          ========================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-700/50">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Live CBT Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-mono font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Weekly Exam Diagnostic Series • Week 43 Live
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            The Weekly Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200">CBT Challenge</span>
          </h1>

          {/* Hero Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Real-time, computer-based adaptive verbal test simulations engineered for international scholars targeting 99th-percentile scores across GRE, GMAT, IELTS, TOEFL, SAT, and PTE Academic.
          </p>

          {/* Prominent Call-To-Action Exam Grid for GRE, GMAT, IELTS, TOEFL, SAT, and PTE */}
          <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
            {examList.map((exam) => (
              <Link
                key={exam.id}
                href={exam.href}
                className={`group relative p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 ${exam.hoverBorder} hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-md flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${exam.badgeColor}`}>
                      {exam.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${exam.accentDot}`}></span>
                      {exam.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {exam.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                  <span>Start CBT Diagnostic</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Metrics Banner */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-slate-400 text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>35-45s Per-Question Timers</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>6 International Exams</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Root Etymology & Mnemonics</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Zero-CLS Fast Headless Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FEATURED VOCABULARY: Responsive 3-Column Grid (5 Most Recent Words)
          ========================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              Daily High-Yield Lexical Stream
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Today&apos;s Featured Vocabulary
            </h2>
            <p className="mt-1 text-slate-600 text-sm max-w-xl">
              Dynamically retrieved from our Markdown academic repository. Showing the 5 most recent exam-critical words across all target test hubs.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
              Showing 5 of {recentWords.length} words
            </span>
            <Link
              href="/words"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group"
            >
              Browse All Words
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentWords.map((item, index) => (
            <article
              key={item.slug}
              className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group ${
                index === 0 ? "relative ring-1 ring-blue-500/30" : ""
              }`}
            >
              <div>
                {/* Header row with tags and badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.examTags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {index === 0 && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
                      Latest
                    </span>
                  )}
                </div>

                {/* Word & Phonetic */}
                <div className="mb-3">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.word}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-slate-500">
                      {item.phonetic}
                    </span>
                    <span className="text-[11px] font-medium italic text-slate-400">
                      • {item.partOfSpeech}
                    </span>
                  </div>
                </div>

                {/* Brief Definition Snippet */}
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {item.definitionSnippet}
                </p>

                {/* Memory anchor peek */}
                {item.memoryTrick?.mnemonic && (
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-0.5 text-[11px] uppercase tracking-wider">
                      💡 Mnemonic Anchor:
                    </span>
                    <p className="line-clamp-2 italic text-slate-600">
                      &quot;{item.memoryTrick.mnemonic}&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer: Read Full Breakdown Link */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-[11px] text-slate-400 font-mono">
                  Added: {item.dateAdded}
                </span>
                <Link
                  href={`/words/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 group-hover:translate-x-0.5 transition-all"
                >
                  <span>Read Full Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}

          {/* 6th Slot in the 3-column grid: Complete Vault CTA card */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col justify-between border border-blue-800">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Explore the Lexical Vault
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Browse our comprehensive index of academic words categorized by Greek/Latin roots, exam frequency, and syllabus tags.
              </p>
              <div className="space-y-1.5 text-xs text-slate-300 font-mono mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GRE & GMAT Logic Clusters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>IELTS & TOEFL Academic Collocations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SAT & PTE Reading Fill in the Blanks</span>
                </div>
              </div>
            </div>

            <Link
              href="/words"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-blue-50 transition-colors"
            >
              <span>View Full Vocabulary Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================
          EDUCATIONAL METHODOLOGY & CBT EXPLAINER
          ========================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Built for International Students
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Traditional Word Lists Fail in CBT Exams
            </h2>
            <p className="mt-3 text-slate-600 text-base leading-relaxed">
              Standardized exams like GRE, GMAT, IELTS, TOEFL, SAT, and PTE Academic do not test rote definitions in isolation. They evaluate lexical precision under strict temporal constraints. VerbalVaultPrep pairs dynamic root etymology with computer-based countdown timers to build instinctive, high-pressure recall.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Headless Dynamic Markdown
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Word pages are rendered from Markdown with structured frontmatter for definitions, sample sentences, synonyms, and mnemonics.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Computer-Based Testing (CBT)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Experience authentic exam stress across 6 standardized tests with real-time countdown timers, question counters, and instant answer rationales.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Dual Mnemonic Retention
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every breakdown pairs vivid acoustic mnemonics with Greek and Latin root etymology for dual-channel memory encoding.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
