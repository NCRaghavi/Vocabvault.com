import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllWords, getWordBySlug } from "@/lib/content";
import AudioPronounceButton from "@/components/AudioPronounceButton";
import AdSlot from "@/components/AdSlot";
import {
  BookOpen,
  ArrowLeft,
  Lightbulb,
  Sparkles,
  Award,
  Compass,
  ArrowRight,
  Share2,
  CheckCircle,
  HelpCircle
} from "lucide-react";

interface WordPageProps {
  params: {
    slug: string;
  };
}

// Generate Static Params for all Markdown words
export async function generateStaticParams() {
  const words = getAllWords();
  return words.map((w) => ({
    slug: w.slug,
  }));
}

// SEO-Optimized Dynamic Metadata
export async function generateMetadata({ params }: WordPageProps): Promise<Metadata> {
  const word = getWordBySlug(params.slug);
  if (!word) {
    return {
      title: "Word Not Found | VerbalVaultPrep",
    };
  }

  const title = `${word.word} - Definition, Sentences & Memory Trick | VerbalVaultPrep`;
  const description = `Learn ${word.word} (${word.phonetic}) for GRE, IELTS, and SAT. Definition: ${word.definitionSnippet} Includes contextual sentences, synonyms, antonyms, and mnemonic tricks.`;

  return {
    title,
    description,
    keywords: [
      word.word,
      `${word.word} definition`,
      `${word.word} GRE`,
      `${word.word} SAT`,
      `${word.word} IELTS`,
      `${word.word} mnemonic`,
      `${word.word} synonyms`,
    ],
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://verbalvaultprep.com/words/${word.slug}`,
      tags: word.examTags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function WordPage({ params }: WordPageProps) {
  const word = getWordBySlug(params.slug);

  if (!word) {
    notFound();
  }

  const allWords = getAllWords();
  const otherWords = allWords.filter((w) => w.slug !== word.slug).slice(0, 4);

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: word.word,
    termCode: word.slug,
    description: word.fullDefinition,
    inDefinedTermSet: "VerbalVaultPrep Academic Vocabulary Engine",
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/words" className="hover:text-blue-600 transition-colors">
            Vocabulary Vault
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{word.word}</span>
        </nav>

        {/* Top Whitespace & Leaderboard Ad Placement */}
        <div className="mb-8">
          <AdSlot type="leaderboard" />
        </div>

        {/* Main Content Grid: 8 Columns Main Content + 4 Columns Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Content Area */}
          <article className="lg:col-span-8 space-y-8">
            {/* Header Card: H1 Heading, Phonetics, Badges */}
            <header className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                  {word.partOfSpeech}
                </span>
                {word.examTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* REQUIRED H1 HEADING */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                <div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                    {word.word}
                  </h1>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="font-mono text-base text-slate-600">
                      {word.phonetic}
                    </span>
                    <AudioPronounceButton word={word.word} />
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono self-start sm:self-auto">
                  Added: {word.dateAdded}
                </div>
              </div>

              <p className="text-lg text-slate-700 font-serif italic leading-relaxed">
                &ldquo;{word.definitionSnippet}&rdquo;
              </p>
            </header>

            {/* BLOCK 1: DEFINITION */}
            <section
              id="definition"
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all hover:border-slate-300"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Academic Definition & Lexical Register
                </h2>
              </div>
              <div className="prose text-slate-700 text-base sm:text-lg leading-relaxed">
                <p>{word.fullDefinition}</p>
              </div>
            </section>

            {/* BLOCK 2: IN CONTEXT (SENTENCE) */}
            <section
              id="in-context"
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm transition-all hover:border-slate-300"
            >
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  In Context (Sentence Example)
                </h2>
              </div>
              <div className="bg-slate-50 border-l-4 border-emerald-500 rounded-r-2xl p-5 my-2">
                <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-serif">
                  {word.inContext}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Tested Pattern: Academic journal register / GRE passage style
                </div>
              </div>
            </section>

            {/* MID-CONTENT AD PLACEMENT WITH GENEROUS WHITESPACE */}
            <div className="my-8">
              <AdSlot type="in-article" />
            </div>

            {/* BLOCK 3 & BLOCK 4: SYNONYMS & ANTONYMS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* BLOCK 3: SYNONYMS */}
              <section
                id="synonyms"
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Synonyms
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    High-yield lexical substitutes for writing & sentence equivalence:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {word.synonyms.map((syn) => (
                      <span
                        key={syn}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* BLOCK 4: ANTONYMS */}
              <section
                id="antonyms"
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                      Antonyms
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    Opposing polarities frequently tested in contrast questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {word.antonyms.map((ant) => (
                      <span
                        key={ant}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-100 hover:bg-rose-100 transition-colors"
                      >
                        {ant}
                      </span>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* BLOCK 5: MEMORY TRICK (MNEMONIC & ETYMOLOGY) */}
            <section
              id="memory-trick"
              className="bg-gradient-to-br from-amber-50/70 via-white to-amber-50/40 rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-amber-200/60">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-amber-500/20">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Memory Trick & Retention Anchors
                  </h2>
                  <p className="text-xs text-slate-500">
                    Engineered for high-pressure recall during timed exams
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Mnemonic Anchor */}
                <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 font-mono block mb-1">
                    🧠 Acoustic / Visual Mnemonic
                  </span>
                  <p className="text-base text-slate-800 font-medium leading-relaxed">
                    {word.memoryTrick.mnemonic}
                  </p>
                </div>

                {/* Etymology Breakdown */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono block mb-1">
                    🏛️ Greek & Latin Root Analysis
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {word.memoryTrick.etymology}
                  </p>
                </div>
              </div>
            </section>

            {/* Additional Markdown Content if present */}
            {word.content && (
              <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm prose prose-slate max-w-none">
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {word.content}
                </div>
              </section>
            )}

            {/* Bottom Whitespace & Footer Ad Placement */}
            <div className="pt-6">
              <AdSlot type="footer" />
            </div>
          </article>

          {/* Sticky Academic Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Test Card */}
            <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-3xl p-6 border border-blue-800 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-300 font-bold bg-blue-800/60 px-2.5 py-1 rounded-md">
                Active CBT Diagnostic
              </span>
              <h3 className="mt-4 text-xl font-extrabold text-white">
                Test Your Knowledge
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                See how &ldquo;{word.word}&rdquo; appears in authentic GRE text completions with our 45-second timer.
              </p>
              <Link
                href="/gre-weekly-challenge"
                className="mt-5 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>Launch GRE Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Sticky Display Ad Placeholder */}
            <div className="sticky top-24 space-y-6">
              <AdSlot type="sidebar" />

              {/* Related High-Yield Words */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Related High-Yield Words
                </h4>
                <div className="space-y-3">
                  {otherWords.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/words/${item.slug}`}
                      className="block p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                          {item.word}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.partOfSpeech}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.definitionSnippet}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/words"
                  className="mt-4 block text-center text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  View all words in vault →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
