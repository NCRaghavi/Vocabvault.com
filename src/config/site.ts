/**
 * Site settings. The values that come from Vercel environment variables can be
 * changed in Vercel → Project → Settings → Environment Variables without touching code.
 */
export const SITE = {
  url: "https://verbalvaultprep.com",
  name: "VerbalVaultPrep",
  /** Apps Script web app URL (Deploy → Web app). Signups from the quiz and signup box go here. */
  subscribeUrl: process.env.NEXT_PUBLIC_SUBSCRIBE_URL || "",
  /** Your Telegram channel, e.g. https://t.me/verbalvaultprep */
  telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_URL || "",
  /** Razorpay payment link for Vault Pass (1 month). Leave empty until you sell it. */
  vaultPassUrl: process.env.NEXT_PUBLIC_VAULT_PASS_URL || "",
  vaultPassUrl6m: process.env.NEXT_PUBLIC_VAULT_PASS_6M_URL || "",
  /** Ads stay hidden until this is "true" (after AdSense approves the site). */
  adsEnabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",
  /** "Who writes this" block. It only shows once authorName is filled in. */
  authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || "",
  authorCredential: process.env.NEXT_PUBLIC_AUTHOR_CREDENTIAL || "",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
};

export interface ExamConfig {
  id: string;
  name: string;
  title: string;
  tag: string;
  href: string;
  lessonDay: string;
  line: string;
  badgeColor: string;
  hoverBorder: string;
  accentDot: string;
  pageTitle: string;
  pageDescription: string;
  guideTitle: string;
  guide: string;
}

export const EXAM_CONFIG: ExamConfig[] = [
  {
    id: "gre", name: "GRE", title: "GRE Verbal", tag: "ETS General Test", href: "/gre-weekly-challenge", lessonDay: "Monday",
    line: "Lesson every Monday. Sunday quiz in Text Completion and Sentence Equivalence format.",
    badgeColor: "bg-blue-600 text-white", hoverBorder: "hover:border-blue-400", accentDot: "bg-blue-400",
    pageTitle: "GRE this week: words, lesson & Sunday quiz",
    pageDescription: "This week's GRE words, a Text Completion and Sentence Equivalence lesson, and a free Sunday quiz with explanations.",
    guideTitle: "How to use this quiz",
    guide: "Text Completion hinges on the clue words in the sentence: find the contrast or continuation signal before you look at the options. In Sentence Equivalence, pick two answers that give the sentence the same meaning; two synonyms that don't fit the sentence are the classic trap.",
  },
  {
    id: "gmat", name: "GMAT", title: "GMAT Focus Verbal", tag: "GMAC Focus Edition", href: "/gmat-weekly-challenge", lessonDay: "Tuesday",
    line: "Lesson every Tuesday. Critical Reasoning questions built on argument words like undermine and infer.",
    badgeColor: "bg-purple-600 text-white", hoverBorder: "hover:border-purple-400", accentDot: "bg-purple-400",
    pageTitle: "GMAT this week: argument words, lesson & Sunday quiz",
    pageDescription: "This week's GMAT argument words, a Critical Reasoning lesson, and a free Sunday quiz with explanations.",
    guideTitle: "How to use this quiz",
    guide: "GMAT Focus doesn't test vocabulary directly, but argument words decide Critical Reasoning answers. Know exactly what undermine, corroborate, presuppose and infer commit you to, and the right option becomes easier to see.",
  },
  {
    id: "ielts", name: "IELTS", title: "IELTS Academic", tag: "Academic Reading & Writing", href: "/ielts-weekly-challenge", lessonDay: "Wednesday",
    line: "Lesson every Wednesday. Collocations and word forms that lift your Lexical Resource score.",
    badgeColor: "bg-emerald-600 text-white", hoverBorder: "hover:border-emerald-400", accentDot: "bg-emerald-400",
    pageTitle: "IELTS this week: words, lesson & Sunday quiz",
    pageDescription: "This week's IELTS Academic words, a collocation and word-form lesson, and a free Sunday quiz with explanations.",
    guideTitle: "How to use this quiz",
    guide: "Lexical Resource rewards precise, natural word choice. Learn each new word with the words it usually sits beside (a collocation) and its noun, verb and adjective forms; that's what this quiz checks.",
  },
  {
    id: "toefl", name: "TOEFL", title: "TOEFL iBT (2026 format)", tag: "ETS iBT", href: "/toefl-weekly-challenge", lessonDay: "Thursday",
    line: "Lesson every Thursday. Complete the Words and vocabulary-in-context practice.",
    badgeColor: "bg-teal-600 text-white", hoverBorder: "hover:border-teal-400", accentDot: "bg-teal-400",
    pageTitle: "TOEFL this week: words, lesson & Sunday quiz",
    pageDescription: "This week's TOEFL words, a lesson in the 2026 format, and a free Sunday quiz with explanations.",
    guideTitle: "How to use this quiz",
    guide: "In Complete the Words, use both the meaning of the sentence and the letters you're given. For vocabulary in context, replace the word with each option and keep the one that leaves the sentence's meaning unchanged.",
  },
  {
    id: "sat", name: "SAT", title: "Digital SAT", tag: "College Board Digital", href: "/sat-weekly-challenge", lessonDay: "Friday",
    line: "Lesson every Friday. Words in Context questions, the way the digital SAT asks them.",
    badgeColor: "bg-amber-600 text-white", hoverBorder: "hover:border-amber-400", accentDot: "bg-amber-400",
    pageTitle: "SAT this week: Words in Context lesson & Sunday quiz",
    pageDescription: "This week's Digital SAT words, a Words in Context lesson, and a free Sunday quiz with explanations.",
    guideTitle: "How to use this quiz",
    guide: "Words in Context asks for the most logical and precise word. Predict your own word for the blank from the passage first, then pick the option closest to it rather than the one that merely sounds academic.",
  },
  {
    id: "pte", name: "PTE", title: "PTE Academic", tag: "Pearson Reading", href: "/pte-weekly-challenge", lessonDay: "Saturday",
    line: "Lesson every Saturday. Fill in the Blanks practice for collocation and word form.",
    badgeColor: "bg-rose-600 text-white", hoverBorder: "hover:border-rose-400", accentDot: "bg-rose-400",
    pageTitle: "PTE this week: words, lesson & Sunday quiz",
    pageDescription: "This week's PTE Academic words, a Fill in the Blanks lesson, and a free Sunday quiz with explanations.",
    guideTitle: "How to use this quiz",
    guide: "Fill in the Blanks is mostly about collocation and grammar. Check the word just before and after the blank: it usually tells you which word form fits and which option sounds natural.",
  },
];

export const examById = (id: string) => EXAM_CONFIG.find((e) => e.id === id);
