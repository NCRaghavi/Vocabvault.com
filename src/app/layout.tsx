import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { BookOpen, GraduationCap, Award, Compass, Search, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "VerbalVaultPrep | Academic CBT Test Prep & Vocabulary Engine",
  description:
    "High-yield verbal mastery for international students preparing for GRE, GMAT, IELTS, TOEFL, SAT, and PTE Academic (Pearson Test of English). Dynamic vocabulary breakdowns, computer-based testing simulations, and memory mnemonics.",
  keywords: [
    "GRE Verbal",
    "GMAT Focus Verbal",
    "IELTS Academic Vocabulary",
    "TOEFL iBT Reading",
    "PTE Academic",
    "Pearson Test of English",
    "SAT Words in Context",
    "CBT Test Prep",
    "Mnemonic Vocabulary",
    "International Test Prep",
  ],
  authors: [{ name: "VerbalVaultPrep Academic Team" }],
  openGraph: {
    title: "VerbalVaultPrep - Master Standardized Exam Vocabulary",
    description: "CBT challenges, dynamic lexical breakdowns, and high-yield mnemonics for GRE, GMAT, IELTS, TOEFL, SAT, and Pearson PTE.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans min-h-screen flex flex-col">
        {/* Top Notification Strip */}
        <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="hidden sm:inline-block font-mono text-emerald-400">
              ● 2026 CBT Diagnostics Live: GRE • GMAT • IELTS • TOEFL • SAT • PTE
            </span>
            <span className="mx-auto sm:mx-0">
              Targeting Top Percentiles? Take our{" "}
              <Link
                href="/gre-weekly-challenge"
                className="text-white underline font-medium hover:text-blue-300 ml-1"
              >
                Weekly Master CBT Challenge →
              </Link>
            </span>
            <span className="hidden md:inline-block text-slate-400">
              Tailored for International Scholars
            </span>
          </div>
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                        Verbal<span className="text-blue-600">Vault</span>Prep
                      </span>
                    </div>
                    <p className="text-[10px] tracking-wider uppercase font-semibold text-slate-500 -mt-1 font-mono">
                      Academic CBT & Lexical Hub
                    </p>
                  </div>
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="hidden xl:flex items-center space-x-1 text-sm font-medium text-slate-700">
                <Link
                  href="/"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/gre-weekly-challenge"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-blue-50 text-blue-700 hover:text-blue-800 font-semibold transition-colors"
                >
                  GRE
                </Link>
                <Link
                  href="/gmat-weekly-challenge"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-purple-50 text-purple-700 hover:text-purple-800 font-semibold transition-colors"
                >
                  GMAT
                </Link>
                <Link
                  href="/ielts-weekly-challenge"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 font-semibold transition-colors"
                >
                  IELTS
                </Link>
                <Link
                  href="/toefl-weekly-challenge"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-teal-50 text-teal-700 hover:text-teal-800 font-semibold transition-colors"
                >
                  TOEFL
                </Link>
                <Link
                  href="/sat-weekly-challenge"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-amber-50 text-amber-700 hover:text-amber-800 font-semibold transition-colors"
                >
                  SAT
                </Link>
                <Link
                  href="/pte-weekly-challenge"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 hover:text-rose-800 font-semibold transition-colors"
                >
                  PTE (Pearson)
                </Link>
                <Link
                  href="/words"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  Vault
                </Link>
              </nav>

              {/* Compact Nav for Medium Screens */}
              <nav className="hidden md:flex xl:hidden items-center space-x-2 text-xs font-semibold text-slate-700">
                <Link href="/gre-weekly-challenge" className="px-2 py-1 rounded bg-blue-50 text-blue-700">GRE</Link>
                <Link href="/gmat-weekly-challenge" className="px-2 py-1 rounded bg-purple-50 text-purple-700">GMAT</Link>
                <Link href="/ielts-weekly-challenge" className="px-2 py-1 rounded bg-emerald-50 text-emerald-700">IELTS</Link>
                <Link href="/toefl-weekly-challenge" className="px-2 py-1 rounded bg-teal-50 text-teal-700">TOEFL</Link>
                <Link href="/sat-weekly-challenge" className="px-2 py-1 rounded bg-amber-50 text-amber-700">SAT</Link>
                <Link href="/pte-weekly-challenge" className="px-2 py-1 rounded bg-rose-50 text-rose-700">PTE</Link>
                <Link href="/words" className="px-2 py-1 rounded hover:bg-slate-100 text-slate-600">Vault</Link>
              </nav>

              {/* Action Button */}
              <div className="flex items-center space-x-3">
                <Link
                  href="/gre-weekly-challenge"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-all shadow-sm hover:shadow active:scale-95"
                >
                  Start Diagnostic
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1">{children}</main>

        {/* Global Academic Footer */}
        <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand Column */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    Verbal<span className="text-blue-400">Vault</span>Prep
                  </span>
                </div>
                <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                  A high-performance headless academic test-prep frontend built for international scholars. Dynamically delivers high-yield lexical breakdowns, root etymology, memory mnemonics, and timed CBT simulations for GRE, GMAT, IELTS, TOEFL, SAT, and PTE Academic success.
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  Dynamic Headless Markdown & JSON Engine
                </div>
              </div>

              {/* CBT Challenges */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
                  Weekly CBT Challenges
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/gre-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      GRE Master Verbal Challenge
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/gmat-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      GMAT Focus Verbal Challenge
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ielts-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      IELTS Academic Band 8+ Challenge
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/toefl-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      TOEFL iBT Academic Reading
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sat-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      Digital SAT Verbal Sprint
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pte-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      Pearson Test of English (PTE)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/words"
                      className="hover:text-white transition-colors"
                    >
                      Browse Complete Vault
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Exam Resources */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
                  High-Yield Breakdown
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/words/substantiate"
                      className="hover:text-white transition-colors"
                    >
                      Word Breakdown: Substantiate
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/words/fallacious"
                      className="hover:text-white transition-colors"
                    >
                      Word Breakdown: Fallacious
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/words/ephemeral"
                      className="hover:text-white transition-colors"
                    >
                      Word Breakdown: Ephemeral
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/words/ubiquitous"
                      className="hover:text-white transition-colors"
                    >
                      Word Breakdown: Ubiquitous
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/words/anachronistic"
                      className="hover:text-white transition-colors"
                    >
                      Word Breakdown: Anachronistic
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/words/lucid"
                      className="hover:text-white transition-colors"
                    >
                      Word Breakdown: Lucid
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
              <p>
                © 2026 VerbalVaultPrep. Built for International Academic Excellence.
              </p>
              <p className="mt-2 sm:mt-0 text-center sm:text-right max-w-xl">
                GRE and TOEFL are trademarks of ETS. GMAT is a trademark of GMAC. SAT is a trademark of CollegeBoard. IELTS is jointly owned by British Council &amp; IDP. PTE Academic is a trademark of Pearson Education.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
