import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { BookOpen, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  metadataBase: new URL("https://verbalvaultprep.com"),
  title: "VerbalVaultPrep: Vocabulary for GRE, GMAT, IELTS, TOEFL, SAT & PTE",
  description:
    "5 words a day, a weekly lesson for your exam, and a free Sunday quiz in real exam format. Remember the words you learn, by test day.",
  alternates: { canonical: "https://verbalvaultprep.com/" },
  openGraph: {
    title: "VerbalVaultPrep: learn the words your exam tests",
    description: "5 words a day, a weekly lesson for your exam, and a free Sunday quiz in real exam format.",
    type: "website",
    locale: "en_IN",
    siteName: "VerbalVaultPrep",
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
          New every Sunday: free quizzes for GRE · GMAT · IELTS · TOEFL · SAT · PTE.{" "}
          <Link href="/#exams" className="text-white underline font-medium hover:text-blue-300 ml-1">
            Take this week&apos;s quiz →
          </Link>
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
                        Verbal<span className="text-blue-600">Vault</span>Prep
                      </span>
                    </div>
                    <p className="hidden sm:block text-[10px] tracking-wider uppercase font-semibold text-slate-500 -mt-1 font-mono">
                      Learn it · use it · remember it
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
                  href="/spotlights"
                  className="px-2.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition-colors"
                >
                  Lessons
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
                  href="/#exams"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-all shadow-sm hover:shadow active:scale-95"
                >
                  <span className="sm:hidden">Sunday quiz</span>
                  <span className="hidden sm:inline">Take Sunday&apos;s quiz</span>
                </Link>
              </div>
            </div>
          </div>
          {/* Phones: exam links in a scrollable row (the full menu only shows on wider screens) */}
          <nav aria-label="Exams" className="md:hidden flex gap-2 overflow-x-auto px-4 pb-2 text-xs font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[["GRE","/gre-weekly-challenge"],["GMAT","/gmat-weekly-challenge"],["IELTS","/ielts-weekly-challenge"],["TOEFL","/toefl-weekly-challenge"],["SAT","/sat-weekly-challenge"],["PTE","/pte-weekly-challenge"],["Lessons","/spotlights"],["Vault","/words"]].map(([label, href]) => (
              <Link key={href} href={href} className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                {label}
              </Link>
            ))}
          </nav>
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
                  VerbalVaultPrep helps students preparing for GRE, GMAT, IELTS, TOEFL, SAT and PTE learn the vocabulary each exam tests, and remember it.
                </p>
              </div>

              {/* CBT Challenges */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
                  Sunday quizzes
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/gre-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      GRE quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/gmat-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      GMAT quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ielts-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      IELTS quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/toefl-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      TOEFL quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sat-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      SAT quiz
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/pte-weekly-challenge"
                      className="hover:text-white transition-colors"
                    >
                      PTE quiz
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

              {/* Learn */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4">
                  Learn
                </h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/#today" className="hover:text-white transition-colors">Today&apos;s 5 words</Link></li>
                  <li><Link href="/spotlights" className="hover:text-white transition-colors">Exam lessons</Link></li>
                  <li><Link href="/vault/a" className="hover:text-white transition-colors">Vault A–Z</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
              <p>
                © 2026 VerbalVaultPrep.
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
