/**
 * VerbalVaultPrep — Night Autopilot (Google Apps Script, bound to your Google Sheet)
 * ==================================================================================
 * THE WEEKLY LEARNING LOOP (spaced retention)
 *   Every day   5 featured "words of the day" (homepage + Telegram)
 *   Mon–Sat     one exam focus article that reuses this week's featured words:
 *               Mon GRE · Tue GMAT · Wed IELTS · Thu TOEFL · Fri SAT · Sat PTE
 *   Sunday      6 quizzes, one per exam, in that exam's real question format.
 *               ~70% this week's featured words, ~30% words featured 3–4 weeks ago (spaced review)
 *   Every night up to 100 extra "vault" word pages (SEO background)
 *
 * SCHEDULE (IST) — all automatic after setupAutopilot()
 *   17:00 daily       nightlyRank()        rates and re-sorts any newly added AP_Queue words (does nothing if none)
 *   19:00–23:00 daily generateRun()        5 evening runs that fill the buffer of checked words (exits at once when full).
 *                                          Only Gemini + this Sheet: it never touches GitHub or Vercel.
 *   01:00 daily       nightlyPublish()     ONE GitHub commit → Vercel redeploys
 *   06:00 Sunday      buildWeeklyPacks()   6 Vault Pass PDFs (one per exam)
 *   07:00 daily       morningTelegram()    5 words + quiz poll; exam post link; Sunday: 6 quiz links
 *   08:00 daily       morningReport()      email to you: what went live, what needs a look
 *   09:00 daily       digestBatch()        Sunday digest per exam (continues daily under email limits)
 *   10:00 daily       memberBatch()        Vault Pass PDF to paying members (continues daily)
 *   18:00 Sun–Fri     generateExamPost()   tomorrow's exam article (checked before it can publish)
 *   14/16/18 Saturday generateQuizzes()    Sunday's 6 quizzes (blind-solved before they can publish)
 *   every hour        fulfillOrders()      Razorpay payments → product link or Vault Pass
 *
 * Secrets live in Project Settings → Script Properties. Nothing secret is in this file.
 */

// ============================== CONFIG ==============================
const CONFIG = {
  TIMEZONE: 'Asia/Kolkata',
  VAULT_PER_NIGHT: 100,          // background vault pages per night. Lower it if Search Console shows "Crawled – not indexed"
                                 // or if you move hosting to Cloudflare Pages free (20,000-file cap per site).
  FEATURED_PER_DAY: 5,
  BATCH_SIZE: 10,                // words per Gemini call
  SUGGEST_WHEN_QUEUE_EMPTY: false, // true = when AP_Queue runs out, Gemini picks new words itself. false = stop making
                                   // new vault pages until you add words (lessons, quizzes and 5-a-day carry on).
  RUN_BUDGET_MS: 200000,         // stop starting new batches after ~3.3 min (Apps Script hard limit is 6 min)
  REVIEW_SHARE: 0.3,             // share of quiz words from 3–4 weeks ago
  QUIZ_DRAFT: 16, QUIZ_KEEP: 10, QUIZ_MIN: 5, // 10 go on the site, up to 6 spares become Vault Pass bonus questions
  GEMINI_MODEL: 'gemini-2.5-flash', // runs on Gemini's FREE tier as long as no billing account is linked to the API key
  // Paths in the NCRaghavi/Vocabvault.com repo (Next.js reads these at build time)
  PATHS: {
    WORDS: 'src/content/words',            // <slug>.md
    POSTS: 'src/content/spotlights',       // <date>-<exam>-<slug>.md  → /spotlights/<date>-<exam>-<slug>
    QUIZ: 'src/content/quizzes',           // <exam>-challenge.json    → /<exam>-weekly-challenge
    FEATURED: 'src/content/featured.json', // today's 5 words on the homepage
  },
  ALREADY_ON_SITE: ['substantiate', 'fallacious', 'ephemeral', 'ubiquitous', 'anachronistic', 'lucid', 'esoteric', 'pragmatic'],
  EXAMS: ['GRE', 'GMAT', 'IELTS', 'TOEFL', 'SAT', 'PTE'],
  POST_DAY: { 1: 'GRE', 2: 'GMAT', 3: 'IELTS', 4: 'TOEFL', 5: 'SAT', 6: 'PTE' }, // 1 = Monday
  // '#quiz' jumps straight to the quiz section of each exam page (students coming from email/Telegram want the quiz)
  CHALLENGE_URL: { GRE: '/gre-weekly-challenge#quiz', GMAT: '/gmat-weekly-challenge#quiz', IELTS: '/ielts-weekly-challenge#quiz', TOEFL: '/toefl-weekly-challenge#quiz', SAT: '/sat-weekly-challenge#quiz', PTE: '/pte-weekly-challenge#quiz' },
  EMAIL_DAILY_LIMIT: 90,         // Gmail ≈100/day. With Brevo set (free 300/day) raise to 280.
  SHEETS: { QUEUE: 'AP_Queue', FEATURED_QUEUE: 'AP_FeaturedQueue', WORDS: 'AP_Words', POSTS: 'AP_Posts', QUIZ: 'AP_Quiz',
    SUBS: 'AP_Subscribers', MEMBERS: 'AP_Members', PRODUCTS: 'AP_Products', ORDERS: 'AP_Orders', PACKS: 'AP_Packs', LOG: 'AP_Log' },
};

/**
 * Exam facts the AI may state. Articles are checked against this block; anything else about
 * test format gets flagged for your review. Re-check once a year against the official sites.
 */
const EXAM_FACTS = {
  GRE: 'GRE General Test (shorter format since Sept 2023). Verbal Reasoning: 2 sections (12 questions in 18 min, 15 questions in 23 min), adaptive by section. Question types: Reading Comprehension, Text Completion (1–3 blanks), Sentence Equivalence (choose exactly 2 of 6 answers that give the same meaning). Verbal score 130–170. Hard vocabulary is tested directly in Text Completion and Sentence Equivalence.',
  GMAT: 'GMAT Focus Edition. Verbal Reasoning: 23 questions in 45 minutes, only Reading Comprehension and Critical Reasoning. Sentence Correction was removed, so vocabulary is not tested directly; it matters for reading speed and for argument language (assume, undermine, corroborate, infer). Total score 205–805.',
  IELTS: 'IELTS Academic. Reading: 3 passages, 40 questions, 60 minutes. Writing: Task 1 (describe visual information, at least 150 words) and Task 2 (essay, at least 250 words) in 60 minutes. Writing and Speaking are each scored on four criteria; one is Lexical Resource (range, precision, collocation, word formation, spelling). Bands 0–9.',
  TOEFL: 'TOEFL iBT, redesigned on 21 January 2026: shorter than before; Reading and Listening are multistage adaptive; scores are reported on a new 1–6 band scale alongside 0–120 during the transition. New task types include Complete the Words (fill in missing letters of words in a paragraph) and Read in Daily Life (Reading); Build a Sentence (Writing); Listen and Repeat (Speaking).',
  SAT: 'Digital SAT. Reading and Writing: 2 adaptive modules of 27 questions, 32 minutes each. Short passages with one question each. Vocabulary is tested through Words in Context questions ("Which choice completes the text with the most logical and precise word or phrase?"). Scores 200–800 per section.',
  PTE: 'PTE Academic: computer-based, about 2 hours, scored 10–90. Reading tasks include Reading & Writing: Fill in the Blanks (dropdown), Multiple Choice, Re-order Paragraphs, and Reading: Fill in the Blanks (drag and drop). Collocation and correct word form (noun/verb/adjective/adverb) decide many fill-in-the-blank items.',
};

/** What each Sunday quiz looks like. `label` is shown above each question. */
const QUIZ_FORMATS = {
  GRE: { seconds: 60, spec: '8 Text Completion (label "Text Completion": one blank shown as ____, exactly 5 options, exactly 1 correct) and 8 Sentence Equivalence (label "Sentence Equivalence": one blank, exactly 6 options, exactly 2 correct that give the SAME meaning; include one tempting synonym pair that does NOT fit the sentence).' },
  GMAT: { seconds: 120, spec: '16 Critical Reasoning (label "Critical Reasoning"): a 3–5 sentence argument (business, science or policy), a blank line, then a question stem (weaken, strengthen, assumption, inference or flaw). Exactly 5 options, exactly 1 correct. Use the target words naturally in the argument or options so understanding them matters.' },
  IELTS: { seconds: 40, spec: '8 Collocation (label "Academic Collocation": an academic sentence with one blank ____, exactly 4 options, exactly 1 forms the natural academic collocation) and 8 Word Form (label "Word Form": the blank needs the right form of a target word family; exactly 4 options, all forms of the same family, exactly 1 correct).' },
  TOEFL: { seconds: 40, spec: '8 Complete the Words (label "Complete the Words": a 2–3 sentence academic paragraph where one target word appears with only its first letters followed by ____, e.g. "corrob____"; exactly 4 full-word options that all start with those letters, exactly 1 correct) and 8 Vocabulary in Context (label "Vocabulary in Context": a 2–3 sentence academic passage, then "The word X in the passage is closest in meaning to"; exactly 4 options, exactly 1 correct).' },
  SAT: { seconds: 70, spec: '16 Words in Context (label "Words in Context"): a 25–80 word passage with one blank ____, then the line "Which choice completes the text with the most logical and precise word or phrase?"; exactly 4 options, exactly 1 correct.' },
  PTE: { seconds: 45, spec: '16 Fill in the Blanks (label "Reading & Writing: Fill in the Blanks"): one academic sentence with a blank ____ testing collocation or word form; exactly 4 options, exactly 1 correct.' },
};

/** Exam post topics, used in rotation. */
const POST_TOPICS = {
  GRE: ['Text Completion: finding the clue that decides the blank', 'Sentence Equivalence: why synonym pairs trap you', 'Secondary meanings the GRE loves', 'Contrast and continuation signal words', 'Positive or negative? Reading a word\'s charge', 'Tone and attitude words in Reading Comprehension', 'Two- and three-blank Text Completions without panic', 'Words that describe arguments'],
  GMAT: ['The vocabulary of arguments: assume, infer, undermine', 'Strengthen and weaken: the words that signal them', 'Scope and quantity words that change an argument', 'Causal language in Critical Reasoning', 'Author\'s tone words in Reading Comprehension', 'Evaluate-the-argument questions and their signal words'],
  IELTS: ['Lexical Resource: what range and precision really mean', 'Academic collocations for Writing Task 2', 'Describing trends precisely in Task 1', 'Word-formation errors that cost bands', 'Paraphrase spotting in Reading', 'Hedging and cautious academic language', 'Topic vocabulary that sounds natural, not memorised'],
  TOEFL: ['Complete the Words: using context and spelling together', 'Read in Daily Life: practical vocabulary', 'Vocabulary questions in academic passages', 'Build a Sentence: word order and word form', 'Precise words for the academic discussion task', 'Signal words that organise a lecture'],
  SAT: ['Words in Context: the most logical and precise word', 'Transitions and the logic they signal', 'Tone words in short passages', 'Common words with uncommon SAT meanings', 'Choosing precise wording in rhetorical synthesis'],
  PTE: ['Fill in the Blanks: collocations that decide the answer', 'Word form in Fill in the Blanks', 'Re-order Paragraphs: linking words and pronouns', 'Academic word families worth knowing', 'Precise paraphrase for summary tasks'],
};

const COLS = {
  WORDS: ['word', 'slug', 'status', 'issues', 'want_featured', 'featured_date', 'exams', 'frequency', 'pos', 'pronunciation', 'definition',
    'register_note', 'examples', 'synonyms', 'synonym_nuance', 'antonyms', 'mnemonic', 'etymology', 'exam_note',
    'mini_q_prompt', 'mini_q_options', 'mini_q_answer', 'mini_q_explanation', 'created_at', 'published_at'],
  POSTS: ['post_date', 'exam', 'topic', 'title', 'slug', 'description', 'words', 'body_md', 'status', 'issues', 'created_at', 'published_at'],
  QUIZ: ['quiz_date', 'exam', 'id', 'label', 'prompt', 'options', 'answer', 'explanation', 'words', 'status', 'issues', 'created_at'],
  SUBS: ['email', 'exam', 'source', 'score', 'subscribed_at', 'status', 'last_digest'],
  MEMBERS: ['email', 'exam', 'expires_at', 'last_pack', 'joined_at'],
  PRODUCTS: ['product_name', 'type', 'months', 'price_inr', 'pay_url', 'drive_url', 'active'],
  ORDERS: ['payment_id', 'email', 'amount_inr', 'product_name', 'status', 'delivered_at', 'note'],
  PACKS: ['quiz_date', 'exam', 'file_id', 'created_at'],
  LOG: ['time', 'job', 'level', 'message'],
};

function props_() { return PropertiesService.getScriptProperties(); }
function prop_(k, required) {
  const v = props_().getProperty(k);
  if (required !== false && !v) throw new Error('Missing Script Property: ' + k);
  return v;
}
function site_() { return (prop_('SITE_URL', false) || '').replace(/\/$/, ''); }
function today_(offsetDays) { return Utilities.formatDate(new Date(Date.now() + (offsetDays || 0) * 86400000), CONFIG.TIMEZONE, 'yyyy-MM-dd'); }
function dow_(offsetDays) { return Number(Utilities.formatDate(new Date(Date.now() + (offsetDays || 0) * 86400000), CONFIG.TIMEZONE, 'u')); } // 1=Mon … 7=Sun
function daysBetween_(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 86400000); }
/** The Sunday a date belongs to as quiz day: Mon–Sat point forward to the coming Sunday. */
function quizSunday_(dateStr) { const d = new Date(dateStr + 'T12:00:00Z'); const dw = d.getUTCDay(); d.setUTCDate(d.getUTCDate() + (dw === 0 ? 0 : 7 - dw)); return d.toISOString().slice(0, 10); }

// ============================== SETUP ==============================
/** Run once by hand. Creates the tabs and the whole schedule. Safe to re-run. */
function setupAutopilot() {
  SpreadsheetApp.getActive().setSpreadsheetTimeZone(CONFIG.TIMEZONE);
  ensureSheet_(CONFIG.SHEETS.QUEUE, ['word']);
  ensureSheet_(CONFIG.SHEETS.FEATURED_QUEUE, ['word']);
  ensureSheet_(CONFIG.SHEETS.WORDS, COLS.WORDS);
  ensureSheet_(CONFIG.SHEETS.POSTS, COLS.POSTS);
  ensureSheet_(CONFIG.SHEETS.QUIZ, COLS.QUIZ);
  ensureSheet_(CONFIG.SHEETS.SUBS, COLS.SUBS);
  ensureSheet_(CONFIG.SHEETS.MEMBERS, COLS.MEMBERS);
  ensureSheet_(CONFIG.SHEETS.PRODUCTS, COLS.PRODUCTS);
  ensureSheet_(CONFIG.SHEETS.ORDERS, COLS.ORDERS);
  ensureSheet_(CONFIG.SHEETS.PACKS, COLS.PACKS);
  ensureSheet_(CONFIG.SHEETS.LOG, COLS.LOG);
  if (!props_().getProperty('UNSUB_SECRET')) props_().setProperty('UNSUB_SECRET', Utilities.getUuid());
  if (!props_().getProperty('ORDERS_SINCE')) props_().setProperty('ORDERS_SINCE', String(Math.floor(Date.now() / 1000) - 3600));

  const mine = ['nightlyRank', 'generateRun', 'nightlyPublish', 'buildWeeklyPacks', 'morningTelegram', 'morningReport', 'digestBatch',
    'memberBatch', 'generateExamPost', 'generateQuizzes', 'fulfillOrders'];
  ScriptApp.getProjectTriggers().forEach(t => { if (mine.indexOf(t.getHandlerFunction()) >= 0) ScriptApp.deleteTrigger(t); });
  const tz = CONFIG.TIMEZONE;
  const daily = (fn, h) => ScriptApp.newTrigger(fn).timeBased().atHour(h).everyDays(1).inTimezone(tz).create();
  const weekly = (fn, day, h) => ScriptApp.newTrigger(fn).timeBased().onWeekDay(day).atHour(h).inTimezone(tz).create();
  daily('nightlyRank', 17);
  [19, 20, 21, 22, 23].forEach(h => daily('generateRun', h)); // evening only; never commits, so no Vercel builds
  ScriptApp.newTrigger('fulfillOrders').timeBased().everyHours(1).create();
  daily('nightlyPublish', 1);
  daily('morningTelegram', 7);
  daily('morningReport', 8);
  daily('digestBatch', 9);
  daily('memberBatch', 10);
  daily('generateExamPost', 18);
  weekly('buildWeeklyPacks', ScriptApp.WeekDay.SUNDAY, 6);
  weekly('generateQuizzes', ScriptApp.WeekDay.SATURDAY, 14);
  weekly('generateQuizzes', ScriptApp.WeekDay.SATURDAY, 16);
  weekly('generateQuizzes', ScriptApp.WeekDay.SATURDAY, 18);
  log_('setup', 'INFO', 'Autopilot installed: 17 schedules.');
  return 'Installed.';
}

/** Run by hand after setup: checks every connection without publishing anything. */
function testConnections() {
  const out = [];
  const t = (name, fn) => { try { fn(); out.push(name + ': OK'); } catch (e) { out.push(name + ': FAIL — ' + e.message); } };
  t('Gemini', () => gemini_('Reply with JSON {"ok":true}', 0));
  t('GitHub', () => github_('GET', '/repos/' + prop_('GITHUB_REPO')));
  t('Telegram', () => telegram_('getMe', {}));
  if (prop_('RAZORPAY_KEY_ID', false)) t('Razorpay', () => razorpay_('/v1/payments?count=1')); else out.push('Razorpay: not set yet (fine until you sell)');
  if (prop_('BREVO_API_KEY', false)) t('Brevo', () => brevoAccount_()); else out.push('Email: using Gmail (≈100/day)');
  Logger.log(out.join('\n'));
  return out;
}

/** Run by hand to test generation end to end: drafts and checks 3 words, publishes nothing. */
function dryRunThreeWords() {
  const entries = draftBatch_(['laconic', 'obdurate', 'equivocate'], {});
  checkBatch_(entries);
  entries.forEach(e => Logger.log(e.word + ' → ' + (e.issues.length ? 'NEEDS_REVIEW: ' + e.issues.join(' | ') : 'APPROVED')));
  return entries;
}

// ============================== 0. RANK NEW WORDS (17:00) ==============================
/** Rates and re-sorts words you added to AP_Queue (rankQueue lives in Seed.gs). Quiet when there's nothing new. */
function nightlyRank() {
  return runJob_('nightlyRank', () => {
    if (typeof rankQueue !== 'function') return null;
    const sh = sheet_(CONFIG.SHEETS.QUEUE);
    const n = sh.getLastRow() - 1;
    if (n < 1) return null;
    const unranked = sh.getRange(2, 1, n, 2).getValues().filter(r => String(r[0]).trim() && !r[1]).length;
    if (!unranked) return null;
    const res = rankQueue();
    return typeof res === 'number' ? `Ranked part of the new words; ${res} left for tomorrow.` : res;
  }, 'doc');
}

// ============================== 1. WORD GENERATION (evening, buffered) ==============================
function generateRun() {
  return runJob_('generateRun', () => {
    const t0 = Date.now();
    const rows = readRows_(CONFIG.SHEETS.WORDS);
    const target = CONFIG.VAULT_PER_NIGHT + CONFIG.FEATURED_PER_DAY + 15;
    let buffer = rows.filter(r => r.status === 'APPROVED').length;
    if (buffer >= target) return null; // buffer full: quiet exit, no log noise
    const existing = new Set(rows.map(r => String(r.word).toLowerCase()).concat(CONFIG.ALREADY_ON_SITE));
    let made = 0, approved = 0;
    while (buffer < target && Date.now() - t0 < CONFIG.RUN_BUDGET_MS) {
      const featuredPicks = takeFromQueue_(CONFIG.SHEETS.FEATURED_QUEUE, CONFIG.BATCH_SIZE, existing);
      const picks = featuredPicks.concat(takeFromQueue_(CONFIG.SHEETS.QUEUE, CONFIG.BATCH_SIZE - featuredPicks.length, existing));
      if (picks.length < CONFIG.BATCH_SIZE && CONFIG.SUGGEST_WHEN_QUEUE_EMPTY) picks.push.apply(picks, suggestWords_(CONFIG.BATCH_SIZE - picks.length, existing));
      if (!picks.length) {
        if (!made) return `Word queue is empty: no new vault words tonight (buffer ${buffer}). Add words to ${CONFIG.SHEETS.QUEUE}.`;
        break;
      }
      picks.forEach(w => existing.add(w));
      const wantFeatured = {}; featuredPicks.forEach(w => wantFeatured[w] = true);
      let entries;
      try {
        entries = draftBatch_(picks, wantFeatured);
        checkBatch_(entries);
      } catch (err) {
        if (!/FREE_LIMIT/.test(err.message)) throw err;
        // Gemini's free daily limit: put the words back and stop quietly. Tomorrow continues. No charge is possible without billing.
        const q = sheet_(featuredPicks.length ? CONFIG.SHEETS.FEATURED_QUEUE : CONFIG.SHEETS.QUEUE);
        q.insertRowsBefore(2, picks.length);
        q.getRange(2, 1, picks.length, 1).setValues(picks.map(w => [w]));
        return `Gemini free limit reached after ${made} words (buffer ${buffer}/${target}). Continuing tomorrow.`;
      }
      entries.forEach(e => {
        e.status = e.issues.length ? 'NEEDS_REVIEW' : 'APPROVED';
        e.issues = e.issues.join(' | ');
        e.created_at = new Date();
        if (e.status === 'APPROVED') { buffer++; approved++; }
        made++;
      });
      appendRows_(CONFIG.SHEETS.WORDS, COLS.WORDS, entries);
    }
    return `Drafted ${made}, approved ${approved}. Buffer ${buffer}/${target}.`;
  }, 'doc');
}

function takeFromQueue_(sheetName, n, existing) {
  if (n <= 0) return [];
  const sh = sheet_(sheetName);
  const last = sh.getLastRow();
  if (last < 2) return [];
  const take = Math.min(last - 1, n * 3);
  const vals = sh.getRange(2, 1, take, 1).getValues();
  const out = [];
  let used = 0;
  for (; used < vals.length && out.length < n; used++) {
    const w = String(vals[used][0] || '').trim().toLowerCase();
    if (w && /^[a-z][a-z' -]*$/.test(w) && !existing.has(w) && out.indexOf(w) < 0) out.push(w);
  }
  if (used) sh.deleteRows(2, used);
  return out;
}

function suggestWords_(n, existing) {
  const avoid = Array.from(existing).slice(-300).join(', ');
  const r = gemini_(`You are a vocabulary teacher for GRE, GMAT, IELTS, TOEFL, SAT and PTE students.
List ${n + 6} useful academic or high-frequency test words (mix of difficulty). Not any of: ${avoid}.
Return JSON {"words": ["lowercase single words"]}`, 0.8);
  return (r.words || []).map(w => String(w).toLowerCase().trim()).filter(w => /^[a-z-]+$/.test(w) && !existing.has(w)).slice(0, n);
}

/** One Gemini call drafts a whole batch. */
function draftBatch_(words, wantFeatured) {
  const r = gemini_(`You write entries for a test-prep vocabulary site read mostly by Indian students. Accuracy matters more than flair.
Words: ${JSON.stringify(words)}
Return JSON {"entries":[ one object per word, same order, with exactly these keys:
 "word", "pos" (part of speech of the most-tested sense), "pronunciation" (IPA),
 "definition" (one clear sentence), "register_note" (1–2 sentences on tone and how it differs from a near-synonym),
 "examples" (3 sentences in academic-passage style using the word naturally; inflections allowed),
 "synonyms" (4–5), "synonym_nuance" (1–2 sentences on the closest synonym's shade of difference), "antonyms" (3–5),
 "mnemonic" (under 30 words, must not teach a false origin), "etymology" (real etymology only, else exactly "Origin uncertain"),
 "exam_note" (1–2 sentences: how tests use the word and a common trap),
 "exams" (which of GRE, GMAT, IELTS, TOEFL, SAT, PTE realistically need this word — 1 to 6 of them),
 "frequency" ("high" | "medium" | "low" for test usefulness),
 "mini_q": {"prompt": "one single-blank sentence (blank as ____) whose answer is this word, under 250 characters",
            "options": [exactly 4 options under 40 characters, one is the word], "answer": index 0–3,
            "explanation": "why it fits and why the best distractor fails, under 190 characters"}
]}`, 0.6);
  const byWord = {};
  (r.entries || []).forEach(x => { if (x && x.word) byWord[String(x.word).toLowerCase()] = x; });
  return words.map(w => {
    const x = byWord[w] || { word: w };
    const mq = x.mini_q || {};
    return {
      word: w, slug: slugify_(w), want_featured: wantFeatured[w] ? 'YES' : '', exams: (x.exams || []).join(', '),
      frequency: x.frequency || '', pos: x.pos || '', pronunciation: x.pronunciation || '', definition: x.definition || '',
      register_note: x.register_note || '', examples: JSON.stringify(x.examples || []), synonyms: (x.synonyms || []).join(', '),
      synonym_nuance: x.synonym_nuance || '', antonyms: (x.antonyms || []).join(', '), mnemonic: x.mnemonic || '',
      etymology: x.etymology || '', exam_note: x.exam_note || '', mini_q_prompt: mq.prompt || '',
      mini_q_options: JSON.stringify(mq.options || []), mini_q_answer: mq.answer, mini_q_explanation: mq.explanation || '',
      issues: [],
    };
  });
}

/** Three gates per word. Any issue → NEEDS_REVIEW (never published until you approve it). */
function checkBatch_(entries) {
  entries.forEach(e => shapeCheck_(e));
  // Gate 2: dictionary API (parallel)
  try {
    const res = UrlFetchApp.fetchAll(entries.map(e => ({ url: 'https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(e.word), muteHttpExceptions: true })));
    res.forEach((r, i) => {
      const e = entries[i];
      if (r.getResponseCode() === 404) { e.issues.push('not in dictionary API'); return; }
      if (r.getResponseCode() !== 200) return; // API hiccup: don't block on it
      const pos = JSON.parse(r.getContentText()).flatMap(x => (x.meanings || []).map(m => m.partOfSpeech));
      if (e.pos && pos.length && !pos.some(p => String(e.pos).toLowerCase().indexOf(p) >= 0)) e.issues.push(`part of speech "${e.pos}" not in dictionary (${pos.join('/')})`);
    });
  } catch (err) { log_('checkBatch', 'WARN', 'dictionary check skipped: ' + err.message); }
  // Gate 3: strict reviewer + blind solver, one call each for the whole batch
  const ok = entries.filter(e => e.definition);
  if (!ok.length) return;
  try {
    const v = gemini_(`You are a strict reviewer for a test-prep vocabulary site. For each entry, list real factual errors only:
wrong definition or part of speech, an example that misuses the word, a wrong synonym/antonym, invented or doubtful etymology,
a mnemonic that teaches a false origin. Do not flag style.
Entries: ${JSON.stringify(ok.map(e => ({ word: e.word, pos: e.pos, definition: e.definition, examples: safeJson_(e.examples, []), synonyms: e.synonyms, antonyms: e.antonyms, mnemonic: e.mnemonic, etymology: e.etymology })))}
Return JSON {"results":[{"word": "...", "errors": ["short description"]}]} — errors empty when the entry is correct.`, 0);
    const errs = {}; (v.results || []).forEach(x => errs[String(x.word).toLowerCase()] = x.errors || []);
    ok.forEach(e => (errs[e.word] || []).forEach(x => e.issues.push('reviewer: ' + x)));
    const s = gemini_(`Answer each question. Return JSON {"answers":[{"word": "<the id given>", "answer": <option index 0-3>}]}.
${ok.map(e => `id=${e.word}: ${e.mini_q_prompt}  Options: ${safeJson_(e.mini_q_options, []).map((o, i) => i + ') ' + o).join('  ')}`).join('\n')}`, 0);
    const ans = {}; (s.answers || []).forEach(x => ans[String(x.word).toLowerCase()] = Number(x.answer));
    ok.forEach(e => { if (ans[e.word] !== Number(e.mini_q_answer)) e.issues.push('blind solver disagreed on the mini question'); });
  } catch (err) { ok.forEach(e => e.issues.push('review pass failed: ' + err.message)); }
}

function shapeCheck_(e) {
  const ex = safeJson_(e.examples, []), opts = safeJson_(e.mini_q_options, []);
  const stem = e.word.slice(0, Math.max(4, e.word.length - 3));
  if (!e.definition || e.definition.length < 15) e.issues.push('definition missing or too short');
  if (ex.length < 3) e.issues.push('fewer than 3 examples');
  else if (ex.some(x => String(x).toLowerCase().indexOf(stem) < 0)) e.issues.push('an example does not use the word');
  if (String(e.synonyms).toLowerCase().split(/,\s*/).indexOf(e.word) >= 0) e.issues.push('word listed as its own synonym');
  if (!e.exams) e.issues.push('no exam tags');
  const a = Number(e.mini_q_answer);
  if (opts.length !== 4 || !(a >= 0 && a < 4)) e.issues.push('mini question malformed');
  else if (String(e.mini_q_prompt).length > 290 || opts.some(o => String(o).length > 95) || String(e.mini_q_explanation).length > 195) e.issues.push('mini question too long for Telegram');
}

// ============================== 2. EXAM FOCUS POST (18:00, for tomorrow) ==============================
function generateExamPost() {
  return runJob_('generateExamPost', () => {
    const exam = CONFIG.POST_DAY[dow_(1)];
    const postDate = today_(1);
    if (!exam) return 'Tomorrow is Sunday (quiz day): no post.';
    if (readRows_(CONFIG.SHEETS.POSTS).some(p => fmtDate_(p.post_date) === postDate)) return 'Post for ' + postDate + ' already drafted.';
    const prior = readRows_(CONFIG.SHEETS.POSTS).filter(p => p.exam === exam).length;
    const topic = POST_TOPICS[exam][prior % POST_TOPICS[exam].length];
    const words = weekWords_(postDate, exam).slice(0, 10);
    const site = site_();
    const r = gemini_(`Write a ${exam} vocabulary article for Indian students, about 900–1,100 words, in Markdown.
Topic: "${topic}".
Use these words from this week's lessons, each at least once, and link the FIRST mention of each as [word](/words/slug):
${words.map(w => `${w.word} (/words/${w.slug}) — ${w.definition}`).join('\n')}
Structure: an opening paragraph that states the key idea; the explanation; 3 worked examples written in the ${exam}'s own question style,
each followed by the answer and why; a short "This week's words in ${exam} context" section; a 5-minute daily practice routine;
a final line inviting readers to Sunday's ${exam} quiz at ${CONFIG.CHALLENGE_URL[exam]}.
FACTS you may state about the exam (state no other format facts, numbers or dates): ${EXAM_FACTS[exam]}
Plain, direct English. No hype, no score guarantees. Do not invent statistics.
Return JSON {"title": "under 65 characters", "description": "under 155 characters", "slug": "url-slug", "body_md": "the article, starting with a ## heading, no H1"}`, 0.6);
    const issues = [];
    const body = String(r.body_md || '');
    const wc = body.split(/\s+/).length;
    if (wc < 700) issues.push('too short (' + wc + ' words)');
    if (!r.title) issues.push('no title');
    words.forEach(w => { if (body.indexOf('/words/' + w.slug) < 0) issues.push('missing link to ' + w.word); });
    try {
      const v = gemini_(`You check articles for a test-prep site. FACTS about ${exam}: ${EXAM_FACTS[exam]}
List real problems only: any claim about the exam's format, timing, scoring or question types that is not supported by FACTS;
any word used with the wrong meaning; any worked example whose stated answer is wrong.
Article: ${body}
Return JSON {"errors": ["short description"]}`, 0);
      (v.errors || []).forEach(x => issues.push('reviewer: ' + x));
    } catch (err) { issues.push('review failed: ' + err.message); }
    appendRows_(CONFIG.SHEETS.POSTS, COLS.POSTS, [{
      post_date: postDate, exam: exam, topic: topic, title: r.title || '', slug: slugify_(r.slug || r.title || topic),
      description: r.description || '', words: words.map(w => w.word).join(', '), body_md: body.slice(0, 45000),
      status: issues.length ? 'NEEDS_REVIEW' : 'APPROVED', issues: issues.join(' | '), created_at: new Date(),
    }]);
    return `${exam} post for ${postDate}: ${issues.length ? 'NEEDS_REVIEW (' + issues.length + ' issue(s))' : 'approved'} — "${r.title}"`;
  });
}

/** Featured words of the quiz week that `dateStr` belongs to, tagged for `exam` first, padded with other featured words. */
function weekWords_(dateStr, exam) {
  const sunday = quizSunday_(dateStr);
  const rows = readRows_(CONFIG.SHEETS.WORDS).filter(r => r.featured_date);
  // the quiz week = the 7 days before quiz Sunday (Sun … Sat)
  const inWeek = rows.filter(r => { const d = daysBetween_(fmtDate_(r.featured_date), sunday); return d >= 1 && d <= 7; });
  const tagged = inWeek.filter(r => String(r.exams).indexOf(exam) >= 0);
  const rest = inWeek.filter(r => tagged.indexOf(r) < 0);
  let out = tagged.concat(rest);
  if (out.length < 5) { // early in the week (or the first week): pad with the most recently featured words
    const recent = rows.slice().sort((a, b) => fmtDate_(b.featured_date) < fmtDate_(a.featured_date) ? -1 : 1);
    out = out.concat(recent.filter(r => out.indexOf(r) < 0 && fmtDate_(r.featured_date) < sunday).slice(0, 10));
  }
  return out;
}

// ============================== 3. SUNDAY QUIZZES (drafted Saturday) ==============================
function generateQuizzes() {
  return runJob_('generateQuizzes', () => {
    const t0 = Date.now();
    const quizDate = dow_() === 7 ? today_() : quizSunday_(today_());
    const done = new Set(readRows_(CONFIG.SHEETS.QUIZ).filter(q => fmtDate_(q.quiz_date) === quizDate).map(q => q.exam));
    const featured = readRows_(CONFIG.SHEETS.WORDS).filter(r => r.featured_date);
    const msgs = [];
    for (let i = 0; i < CONFIG.EXAMS.length; i++) {
      const exam = CONFIG.EXAMS[i];
      if (done.has(exam)) continue;
      if (Date.now() - t0 > CONFIG.RUN_BUDGET_MS) { msgs.push('time budget reached; next run continues'); break; }
      const week = weekWords_(quizDate, exam).slice(0, 14);
      const review = featured.filter(r => { const d = daysBetween_(fmtDate_(r.featured_date), quizDate); return d >= 21 && d <= 34; })
        .sort((a, b) => (String(b.exams).indexOf(exam) >= 0) - (String(a.exams).indexOf(exam) >= 0)).slice(0, 6);
      const nReview = review.length ? Math.round(CONFIG.QUIZ_DRAFT * CONFIG.REVIEW_SHARE) : 0;
      const r = gemini_(`Write original ${exam} practice questions for Indian students. Medium to hard.
FORMAT: ${QUIZ_FORMATS[exam].spec}
Test these words from this week's lessons in ${CONFIG.QUIZ_DRAFT - nReview} questions: ${week.map(w => w.word).join(', ')}.
${nReview ? `Test these words from 3–4 weeks ago in ${nReview} questions (spaced review): ${review.map(w => w.word).join(', ')}.` : ''}
Each question tests one target word (as the answer, or where understanding it is required).
FACTS about the exam: ${EXAM_FACTS[exam]}
Return JSON {"questions":[{"label": "...", "prompt": "... (use \\n for line breaks)", "options": ["..."], "answer": [correct option indices],
 "explanation": "2–3 sentences: the clue, why the answer fits, why the best trap fails", "words": ["tested word"], "review": true|false}]}`, 0.7);
      const qs = (r.questions || []).filter(q => q && Array.isArray(q.options));
      const issues = qs.map(q => shapeQuestion_(exam, q));
      try {
        const s = gemini_(`Solve each ${exam} question independently. For two-answer questions choose exactly two options that give the sentence the same meaning.
${qs.map((q, k) => `Q${k}: [${q.label}] ${q.prompt}\nOptions: ${q.options.map((o, j) => j + ') ' + o).join('  ')}\nNumber of answers: ${(q.answer || []).length}`).join('\n\n')}
Return JSON {"answers":[{"q": <number>, "answer": [indices], "unique": true|false}]} — "unique" false if another answer is also defensible.`, 0);
        const by = {}; (s.answers || []).forEach(a => by[Number(a.q)] = a);
        qs.forEach((q, k) => {
          const a = by[k];
          if (!a) { issues[k].push('solver skipped it'); return; }
          if ((a.answer || []).map(Number).sort().join(',') !== (q.answer || []).map(Number).sort().join(',')) issues[k].push('blind solver disagreed');
          if (a.unique === false) issues[k].push('more than one defensible answer');
        });
      } catch (err) { qs.forEach((q, k) => issues[k].push('solver failed: ' + err.message)); }
      let kept = 0;
      const rows = qs.map((q, k) => {
        const status = issues[k].length ? 'REJECTED' : (kept < CONFIG.QUIZ_KEEP ? (kept++, 'APPROVED') : 'BONUS');
        return { quiz_date: quizDate, exam: exam, id: exam.toLowerCase() + '-' + quizDate + '-' + (k + 1), label: q.label, prompt: q.prompt,
          options: JSON.stringify(q.options), answer: JSON.stringify(q.answer), explanation: q.explanation,
          words: (q.words || []).join(', ') + (q.review ? ' (review)' : ''), status: status, issues: issues[k].join(' | '), created_at: new Date() };
      });
      if (rows.length) appendRows_(CONFIG.SHEETS.QUIZ, COLS.QUIZ, rows);
      msgs.push(`${exam}: ${kept}/${qs.length} passed${kept < CONFIG.QUIZ_MIN ? ' (TOO FEW — last week stays live)' : ''}`);
    }
    return msgs.length ? `Quizzes for ${quizDate}: ` + msgs.join('; ') : null;
  });
}

function shapeQuestion_(exam, q) {
  const issues = [];
  const n = (q.options || []).length, a = q.answer || [];
  const two = /Sentence Equivalence/i.test(q.label || '');
  const wantOpts = exam === 'GRE' ? (two ? 6 : 5) : exam === 'GMAT' ? 5 : 4;
  if (n !== wantOpts) issues.push(`needs ${wantOpts} options, has ${n}`);
  if (a.length !== (two ? 2 : 1)) issues.push('wrong number of answers');
  if (a.some(x => !(Number(x) >= 0 && Number(x) < n))) issues.push('answer index out of range');
  if (exam !== 'GMAT' && !/Vocabulary in Context/i.test(q.label || '') && String(q.prompt).indexOf('____') < 0) issues.push('no blank');
  if (!q.explanation) issues.push('no explanation');
  return issues;
}

// ============================== 4. PUBLISH (01:00, one commit) ==============================
function nightlyPublish() {
  return runJob_('nightlyPublish', () => {
    const today = today_();
    const wordsSh = sheet_(CONFIG.SHEETS.WORDS);
    const rows = readRows_(CONFIG.SHEETS.WORDS);
    const files = [], notes = [];

    // a) 5 featured words for today
    let featured = rows.filter(r => fmtDate_(r.featured_date) === today);
    if (!featured.length) {
      const pool = rows.filter(r => (r.status === 'APPROVED' || r.status === 'PUBLISHED') && !r.featured_date);
      const score = r => (r.want_featured ? 100 : 0) + (r.frequency === 'high' ? 10 : r.frequency === 'medium' ? 5 : 0) + String(r.exams).split(',').length;
      featured = pool.sort((a, b) => score(b) - score(a)).slice(0, CONFIG.FEATURED_PER_DAY);
      featured.forEach(r => { r.featured_date = today; });
    }
    // b) vault words
    const vault = rows.filter(r => r.status === 'APPROVED' && !(r.want_featured && !r.featured_date) && featured.indexOf(r) < 0).slice(0, CONFIG.VAULT_PER_NIGHT); // featured-queue words wait for their day
    const goingLive = featured.concat(vault);
    goingLive.forEach(r => files.push({ path: CONFIG.PATHS.WORDS + '/' + r.slug + '.md', content: wordToMarkdown_(r, r.published_at ? fmtDate_(r.published_at) : today) }));
    if (featured.length) files.push({ path: CONFIG.PATHS.FEATURED, content: JSON.stringify({ date: today, slugs: featured.map(r => r.slug) }, null, 2) });
    notes.push(`${featured.length} featured, ${vault.length} vault`);

    // c) today's exam post
    const postsSh = sheet_(CONFIG.SHEETS.POSTS);
    const post = readRows_(CONFIG.SHEETS.POSTS).find(p => fmtDate_(p.post_date) === today && p.status === 'APPROVED');
    if (post) { files.push({ path: `${CONFIG.PATHS.POSTS}/${today}-${post.exam.toLowerCase()}-${post.slug}.md`, content: postToMarkdown_(post) }); notes.push(post.exam + ' post'); }

    // d) Sunday: the six quizzes
    const quizNotes = [];
    if (dow_() === 7) {
      const qs = readRows_(CONFIG.SHEETS.QUIZ).filter(q => fmtDate_(q.quiz_date) === today && q.status === 'APPROVED');
      CONFIG.EXAMS.forEach(exam => {
        const mine = qs.filter(q => q.exam === exam);
        if (mine.length >= CONFIG.QUIZ_MIN) { files.push({ path: `${CONFIG.PATHS.QUIZ}/${exam.toLowerCase()}-challenge.json`, content: JSON.stringify(quizJson_(exam, today, mine), null, 2) }); quizNotes.push(exam); }
      });
      if (quizNotes.length) notes.push('quizzes: ' + quizNotes.join(', '));
    }
    if (!files.length) return 'Nothing to publish.';

    // (the site builds its own A–Z vault pages and sitemap.xml from these files)
    const sha = commitFiles_(files, `Autopilot ${today}: ${notes.join(', ')}`);
    // f) record what went live
    goingLive.forEach(r => updateRow_(wordsSh, r._row, COLS.WORDS, Object.assign({ status: 'PUBLISHED', published_at: r.published_at || today }, featured.indexOf(r) >= 0 ? { featured_date: today } : {})));
    if (post) updateRow_(postsSh, post._row, COLS.POSTS, { status: 'PUBLISHED', published_at: today });
    if (quizNotes.length) props_().setProperty('LAST_QUIZ_DATE', today);
    return `Commit ${sha.slice(0, 7)}: ${notes.join(', ')}.`;
  });
}

function featuredJson_(r) {
  return { word: cap_(r.word), slug: r.slug, pos: r.pos, pronunciation: r.pronunciation, definition: r.definition,
    mnemonic: r.mnemonic, exams: String(r.exams).split(/,\s*/).filter(Boolean) };
}

/** Word file in the site's own frontmatter format (src/lib/content.ts reads these fields). */
function wordToMarkdown_(r, date) {
  const ex = safeJson_(r.examples, []), opts = safeJson_(r.mini_q_options, []);
  const list = v => String(v || '').split(/,\s*/).filter(Boolean);
  const j = v => JSON.stringify(v == null ? '' : v); // JSON values are valid YAML
  const fm = {
    word: cap_(r.word), slug: r.slug, phonetic: r.pronunciation, partOfSpeech: r.pos,
    definitionSnippet: r.definition,
    fullDefinition: [r.definition, r.register_note].filter(Boolean).join(' '),
    examTags: list(r.exams), dateAdded: date,
    inContext: ex[0] || '', examples: ex,
    synonyms: list(r.synonyms), synonymNuance: r.synonym_nuance || '', antonyms: list(r.antonyms),
    memoryTrick: { mnemonic: r.mnemonic || '', etymology: r.etymology || '' },
    examNote: r.exam_note || '',
    quickCheck: opts.length === 4 ? { prompt: r.mini_q_prompt, options: opts, answerIndex: Number(r.mini_q_answer), explanation: r.mini_q_explanation || '' } : null,
    featuredDate: r.featured_date ? fmtDate_(r.featured_date) : '',
  };
  return ['---'].concat(Object.keys(fm).filter(k => fm[k] !== null).map(k => k + ': ' + j(fm[k]))).concat(['---', '']).join('\n');
}

function postToMarkdown_(p) {
  const y = v => JSON.stringify(v == null ? '' : String(v));
  const site = site_();
  return ['---', 'title: ' + y(p.title), 'slug: ' + y(p.slug), 'exam: ' + y(p.exam), 'date: ' + y(fmtDate_(p.post_date)),
    'description: ' + y(p.description), 'words: ' + JSON.stringify(String(p.words).split(/,\s*/).filter(Boolean)),
    'quiz: ' + y(CONFIG.CHALLENGE_URL[p.exam]), '---', '', p.body_md, ''].filter(x => x !== null).join('\n');
}

/** Quiz file in the site's QuizData shape (src/lib/content.ts). Two-answer questions use correctIndices. */
function quizJson_(exam, date, rows) {
  const fmt = QUIZ_FORMATS[exam];
  return {
    examId: exam.toLowerCase(),
    examTitle: 'Sunday ' + exam + ' Quiz',
    subtitle: rows.length + ' questions on this week\'s words, in real ' + exam + ' format. Older words from 3–4 weeks ago come back too.',
    timePerQuestionSeconds: fmt.seconds,
    passingScorePercentage: 70,
    instructions: ['You have ' + fmt.seconds + ' seconds per question; the quiz moves on when time runs out.', 'Your score appears the moment you finish.'],
    week: date,
    questions: rows.map((q, k) => {
      const ans = safeJson_(q.answer, []).map(Number);
      return { id: k + 1, type: q.label, label: q.label, prompt: q.prompt, options: safeJson_(q.options, []),
        correctIndex: ans[0], correctIndices: ans.length > 1 ? ans : undefined, explanation: q.explanation,
        words: String(q.words || '').replace(' (review)', '').split(/,\s*/).filter(Boolean) };
    }),
  };
}

/** One commit for all files (Git Data API): keeps Vercel to one build a night. */
function commitFiles_(files, message) {
  const repo = '/repos/' + prop_('GITHUB_REPO');
  const branch = prop_('GITHUB_BRANCH', false) || 'main';
  const ref = github_('GET', repo + '/git/ref/heads/' + branch);
  const base = github_('GET', repo + '/git/commits/' + ref.object.sha);
  const tree = github_('POST', repo + '/git/trees', { base_tree: base.tree.sha, tree: files.map(f => ({ path: f.path, mode: '100644', type: 'blob', content: f.content })) });
  const commit = github_('POST', repo + '/git/commits', { message: message, tree: tree.sha, parents: [ref.object.sha] });
  github_('PATCH', repo + '/git/refs/heads/' + branch, { sha: commit.sha });
  return commit.sha;
}

// ============================== 5. TELEGRAM (07:00) ==============================
function morningTelegram() {
  return runJob_('morningTelegram', () => {
    const chat = prop_('TELEGRAM_CHANNEL'), site = site_(), today = today_();
    if (props_().getProperty('TG_LAST') === today) return 'Already posted today.';
    const featured = readRows_(CONFIG.SHEETS.WORDS).filter(r => fmtDate_(r.featured_date) === today && r.status === 'PUBLISHED');
    const sent = [];
    if (featured.length) {
      const html = `<b>Today's ${featured.length} words</b>\n\n` + featured.map((w, i) =>
        `${i + 1}. <b>${esc_(cap_(w.word))}</b> <i>(${esc_(w.pos)})</i> — ${esc_(w.definition)}\n💡 ${esc_(w.mnemonic)}` +
        (site ? `\n<a href="${site}/words/${w.slug}">Full breakdown</a>` : '')).join('\n\n');
      telegram_('sendMessage', { chat_id: chat, text: html.slice(0, 4000), parse_mode: 'HTML', disable_web_page_preview: true });
      const q = featured.find(w => safeJson_(w.mini_q_options, []).length === 4);
      if (q) telegram_('sendPoll', { chat_id: chat, question: String(q.mini_q_prompt).slice(0, 300),
        options: JSON.stringify(safeJson_(q.mini_q_options, []).map(o => String(o).slice(0, 100))), type: 'quiz',
        correct_option_id: Number(q.mini_q_answer), explanation: String(q.mini_q_explanation || '').slice(0, 200), is_anonymous: true });
      sent.push(featured.length + ' words + poll');
    }
    const post = readRows_(CONFIG.SHEETS.POSTS).find(p => fmtDate_(p.post_date) === today && p.status === 'PUBLISHED');
    if (post && site) {
      telegram_('sendMessage', { chat_id: chat, text: `📘 ${post.exam} focus: ${post.title}\nUses this week's words in real ${post.exam} questions.\n${site}/spotlights/${today}-${post.exam.toLowerCase()}-${post.slug}` });
      sent.push(post.exam + ' post');
    }
    if (dow_() === 7 && props_().getProperty('LAST_QUIZ_DATE') === today && site) {
      telegram_('sendMessage', { chat_id: chat, text: `🧠 Sunday quiz day. This week's words, in your exam's format:\n\n` +
        CONFIG.EXAMS.map(e => `${e}: ${site}${CONFIG.CHALLENGE_URL[e]}`).join('\n') });
      sent.push('quiz links');
    }
    const pass = activeProducts_().find(p => p.type === 'pass');
    if (dow_() === 3 && pass) { telegram_('sendMessage', { chat_id: chat, text: `${pass.product_name}: every Sunday's quiz with full explanations, bonus questions and a printable revision PDF for your exam. ₹${pass.price_inr}. ${pass.pay_url}` }); sent.push('pass promo'); }
    props_().setProperty('TG_LAST', today);
    return sent.length ? 'Posted: ' + sent.join(', ') : 'Nothing to post.';
  });
}

// ============================== 6. SIGNUP + UNSUBSCRIBE (web app) ==============================
/** Website widgets POST {type:'subscribe', email, exam, score, source} here. */
function doPost(e) {
  try {
    const b = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (b.type !== 'subscribe') return json_({ ok: false });
    const email = String(b.email || '').trim().toLowerCase();
    const exam = String(b.exam || '').toUpperCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 120 || CONFIG.EXAMS.indexOf(exam) < 0) return json_({ ok: false });
    const sh = sheet_(CONFIG.SHEETS.SUBS);
    const r = readRows_(CONFIG.SHEETS.SUBS).find(x => x.email === email && x.exam === exam);
    if (r) { if (r.status !== 'ACTIVE') updateRow_(sh, r._row, COLS.SUBS, { status: 'ACTIVE' }); return json_({ ok: true }); }
    appendRows_(CONFIG.SHEETS.SUBS, COLS.SUBS, [{ email: email, exam: exam, source: String(b.source || '').slice(0, 40),
      score: String(b.score || '').slice(0, 12), subscribed_at: new Date(), status: 'ACTIVE' }]);
    return json_({ ok: true });
  } catch (err) { log_('doPost', 'ERROR', err.message); return json_({ ok: false }); }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.unsub && p.t === unsubToken_(p.unsub)) {
    const sh = sheet_(CONFIG.SHEETS.SUBS);
    readRows_(CONFIG.SHEETS.SUBS).filter(x => x.email === String(p.unsub).toLowerCase()).forEach(r => updateRow_(sh, r._row, COLS.SUBS, { status: 'UNSUBSCRIBED' }));
    return HtmlService.createHtmlOutput('<p style="font-family:sans-serif">You are unsubscribed. Good luck with your exam.</p>');
  }
  return HtmlService.createHtmlOutput('OK');
}
function unsubToken_(email) { return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(String(email).toLowerCase(), prop_('UNSUB_SECRET'))).slice(0, 16); }
function unsubLink_(email) { return ScriptApp.getService().getUrl() + '?unsub=' + encodeURIComponent(email) + '&t=' + unsubToken_(email); }

// ============================== 7. SUNDAY DIGEST, PER EXAM (09:00, continues daily) ==============================
function digestBatch() {
  return runJob_('digestBatch', () => {
    const last = props_().getProperty('LAST_QUIZ_DATE');
    if (!last || daysBetween_(last, today_()) > 6) return null;
    const subs = readRows_(CONFIG.SHEETS.SUBS).filter(s => s.status === 'ACTIVE' && fmtDate_(s.last_digest) !== last);
    if (!subs.length) return null;
    const site = site_(), sh = sheet_(CONFIG.SHEETS.SUBS);
    const posts = readRows_(CONFIG.SHEETS.POSTS).filter(p => p.status === 'PUBLISHED' && daysBetween_(fmtDate_(p.post_date), last) >= 0 && daysBetween_(fmtDate_(p.post_date), last) <= 6);
    const pass = activeProducts_().find(p => p.type === 'pass');
    let sent = 0;
    for (let i = 0; i < subs.length; i++) {
      if (!emailBudgetLeft_()) break;
      const s = subs[i];
      const words = weekWords_(last, s.exam).slice(0, 12);
      const post = posts.find(p => p.exam === s.exam);
      const html = `<div style="font-family:Arial,sans-serif;max-width:560px;color:#0f172a">
<h2 style="margin:0 0 8px">Your ${s.exam} quiz is live</h2>
<p>This week's words, tested in real ${s.exam} question format. About 8 minutes.</p>
<p><a href="${site}${CONFIG.CHALLENGE_URL[s.exam]}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold">Take the ${s.exam} quiz</a></p>
${post ? `<p>Missed this week's ${s.exam} lesson? <a href="${site}/spotlights/${fmtDate_(post.post_date)}-${s.exam.toLowerCase()}-${post.slug}">${esc_(post.title)}</a></p>` : ''}
<h3>Words to revise before you start</h3><ul>${words.map(w => `<li><a href="${site}/words/${w.slug}"><b>${esc_(cap_(w.word))}</b></a> — ${esc_(w.definition)}</li>`).join('')}</ul>
${pass ? `<p style="padding:12px;background:#eef4ff;border-radius:8px"><b>${esc_(pass.product_name)}</b>: bonus questions and a printable revision PDF for ${s.exam} every Sunday. ₹${pass.price_inr}. <a href="${pass.pay_url}">Join here</a>.</p>` : ''}
<p style="color:#888;font-size:12px">You signed up for ${s.exam} updates at VerbalVaultPrep. <a href="${unsubLink_(s.email)}">Unsubscribe</a></p></div>`;
      sendEmail_({ to: s.email, subject: `Your ${s.exam} quiz for this week is live`, html: html });
      updateRow_(sh, s._row, COLS.SUBS, { last_digest: last });
      sent++;
    }
    return `Digest ${last}: sent ${sent}; ${subs.length - sent} left for tomorrow.`;
  });
}

// ============================== 8. VAULT PASS: weekly PDF packs + member emails ==============================
function buildWeeklyPacks() {
  return runJob_('buildWeeklyPacks', () => {
    const date = props_().getProperty('LAST_QUIZ_DATE');
    if (date !== today_()) return 'No quizzes went live today; no packs.';
    const quiz = readRows_(CONFIG.SHEETS.QUIZ).filter(q => fmtDate_(q.quiz_date) === date && (q.status === 'APPROVED' || q.status === 'BONUS'));
    const made = [];
    const folder = packsFolder_();
    CONFIG.EXAMS.forEach(exam => {
      const qs = quiz.filter(q => q.exam === exam);
      if (!qs.length) return;
      const words = weekWords_(date, exam).slice(0, 20);
      const doc = DocumentApp.create(`VerbalVaultPrep ${exam} Revision Pack ${date}`);
      const body = doc.getBody();
      body.appendParagraph(`${exam} Revision Pack · week ending ${date}`).setHeading(DocumentApp.ParagraphHeading.TITLE);
      body.appendParagraph('This week\'s words').setHeading(DocumentApp.ParagraphHeading.HEADING1);
      words.forEach(w => {
        body.appendParagraph(`${cap_(w.word)} (${w.pos})`).setHeading(DocumentApp.ParagraphHeading.HEADING3);
        body.appendParagraph(w.definition);
        body.appendParagraph('Example: ' + (safeJson_(w.examples, [])[0] || '')).setItalic(true);
        body.appendParagraph('Memory trick: ' + w.mnemonic).setItalic(false);
        body.appendParagraph('Synonyms: ' + w.synonyms + '   ·   Antonyms: ' + w.antonyms);
      });
      body.appendPageBreak();
      body.appendParagraph(`Practice: ${qs.length} questions (${qs.filter(q => q.status === 'BONUS').length} bonus, members only)`).setHeading(DocumentApp.ParagraphHeading.HEADING1);
      qs.forEach((q, k) => {
        body.appendParagraph(`${k + 1}. [${q.label}]${q.status === 'BONUS' ? ' BONUS' : ''}`).setHeading(DocumentApp.ParagraphHeading.HEADING3);
        String(q.prompt).split('\n').forEach(line => body.appendParagraph(line));
        safeJson_(q.options, []).forEach((o, j) => body.appendParagraph('ABCDEF'.charAt(j) + ') ' + o));
      });
      body.appendPageBreak();
      body.appendParagraph('Answers and explanations').setHeading(DocumentApp.ParagraphHeading.HEADING1);
      qs.forEach((q, k) => body.appendParagraph(`${k + 1}. ${safeJson_(q.answer, []).map(a => 'ABCDEF'.charAt(a)).join(' & ')} — ${q.explanation}`));
      doc.saveAndClose();
      const pdf = DriveApp.getFileById(doc.getId()).getAs(MimeType.PDF).setName(`VerbalVaultPrep-${exam}-${date}.pdf`);
      const file = folder.createFile(pdf);
      DriveApp.getFileById(doc.getId()).setTrashed(true);
      appendRows_(CONFIG.SHEETS.PACKS, COLS.PACKS, [{ quiz_date: date, exam: exam, file_id: file.getId(), created_at: new Date() }]);
      made.push(exam);
    });
    return `Packs ${date}: ${made.join(', ') || 'none'}.`;
  });
}

function memberBatch() {
  return runJob_('memberBatch', () => {
    const date = props_().getProperty('LAST_QUIZ_DATE');
    if (!date) return null;
    const packs = readRows_(CONFIG.SHEETS.PACKS).filter(p => fmtDate_(p.quiz_date) === date);
    if (!packs.length) return null;
    const now = Date.now(), sh = sheet_(CONFIG.SHEETS.MEMBERS);
    const due = readRows_(CONFIG.SHEETS.MEMBERS).filter(m => new Date(m.expires_at).getTime() > now && fmtDate_(m.last_pack) !== date);
    let sent = 0;
    for (let i = 0; i < due.length && emailBudgetLeft_(); i++) {
      const m = due[i];
      sendPack_(m.email, m.exam, packs, date);
      updateRow_(sh, m._row, COLS.MEMBERS, { last_pack: date });
      sent++;
    }
    return sent || due.length ? `Packs sent ${sent}; ${due.length - sent} left.` : null;
  });
}

function sendPack_(email, exam, packs, date) {
  const mine = packs.filter(p => !exam || p.exam === exam);
  const files = (mine.length ? mine : packs).map(p => DriveApp.getFileById(p.file_id).getBlob());
  sendEmail_({ to: email, subject: `Your ${exam || 'VerbalVaultPrep'} revision pack (${date})`, attachments: files,
    html: `<div style="font-family:Arial,sans-serif"><p>Your weekly revision pack is attached: this week's words, the Sunday quiz with bonus questions, and full answers.</p>
<p>Best way to use it: revise the words tonight, attempt the questions tomorrow without looking, then check the answers.</p>
<p style="color:#888;font-size:12px">Vault Pass member email. Questions? Just reply.</p></div>` });
}

// ============================== 9. ORDERS: Razorpay → product link or Vault Pass (hourly) ==============================
/** Matches each captured payment to a product by PRICE — so give every product a different price. */
function fulfillOrders() {
  return runJob_('fulfillOrders', () => {
    if (!prop_('RAZORPAY_KEY_ID', false)) return null;
    const since = Number(prop_('ORDERS_SINCE', false)), now = Math.floor(Date.now() / 1000);
    const products = activeProducts_();
    const done = new Set(readRows_(CONFIG.SHEETS.ORDERS).map(o => o.payment_id));
    const res = razorpay_('/v1/payments?count=100&from=' + (since - 900) + '&to=' + now);
    const out = [];
    (res.items || []).forEach(p => {
      if (p.status !== 'captured' || done.has(p.id)) return;
      const inr = p.amount / 100, prod = products.find(x => Number(x.price_inr) === inr), email = String(p.email || '').toLowerCase();
      const row = { payment_id: p.id, email: email, amount_inr: inr, product_name: prod ? prod.product_name : '', status: '', delivered_at: '', note: '' };
      if (!prod) { row.status = 'NO_MATCH'; row.note = 'No active product at this price: deliver by hand.'; }
      else if (!email || email === 'void@razorpay.com') { row.status = 'NO_EMAIL'; row.note = 'No email; phone ' + (p.contact || '?'); }
      else if (prod.type === 'pass') { grantPass_(email, Number(prod.months) || 1); row.status = 'PASS_GRANTED'; row.delivered_at = new Date(); }
      else {
        sendEmail_({ to: email, subject: 'Your ' + prod.product_name, html: `<div style="font-family:Arial,sans-serif"><p>Thank you for your purchase.</p><p><b>Download:</b> <a href="${prod.drive_url}">${esc_(prod.product_name)}</a></p><p>Payment ID ${p.id}. Reply if anything doesn't open.</p></div>` });
        row.status = 'DELIVERED'; row.delivered_at = new Date();
      }
      appendRows_(CONFIG.SHEETS.ORDERS, COLS.ORDERS, [row]);
      out.push(row.status);
    });
    props_().setProperty('ORDERS_SINCE', String(now));
    return out.length ? 'Orders: ' + out.join(', ') : null;
  });
}

function grantPass_(email, months) {
  const sh = sheet_(CONFIG.SHEETS.MEMBERS);
  const m = readRows_(CONFIG.SHEETS.MEMBERS).find(x => x.email === email);
  const sub = readRows_(CONFIG.SHEETS.SUBS).filter(s => s.email === email).pop();
  const exam = (m && m.exam) || (sub && sub.exam) || '';
  const base = m && new Date(m.expires_at).getTime() > Date.now() ? new Date(m.expires_at) : new Date();
  const exp = new Date(base.getTime()); exp.setMonth(exp.getMonth() + months);
  if (m) updateRow_(sh, m._row, COLS.MEMBERS, { expires_at: exp });
  else appendRows_(CONFIG.SHEETS.MEMBERS, COLS.MEMBERS, [{ email: email, exam: exam, expires_at: exp, last_pack: '', joined_at: new Date() }]);
  const date = props_().getProperty('LAST_QUIZ_DATE');
  const all = date ? readRows_(CONFIG.SHEETS.PACKS).filter(p => fmtDate_(p.quiz_date) === date) : [];
  const attach = exam ? all.filter(p => p.exam === exam) : all;
  sendEmail_({ to: email, subject: 'Welcome to Vault Pass', attachments: attach.map(p => DriveApp.getFileById(p.file_id).getBlob()),
    html: `<div style="font-family:Arial,sans-serif"><p>Welcome to Vault Pass. It runs until <b>${Utilities.formatDate(exp, CONFIG.TIMEZONE, 'd MMM yyyy')}</b>.</p>
<p>Every Sunday you'll get a revision PDF${exam ? ' for ' + exam : ' for each exam'}: the week's words, the quiz plus bonus questions, and full explanations.${attach.length ? ' This week\'s pack is attached.' : ' Your first pack arrives this Sunday.'}</p>
${exam ? '' : '<p>Reply with your exam (GRE, GMAT, IELTS, TOEFL, SAT or PTE) and I\'ll send only that one.</p>'}</div>` });
  if (attach.length) { const row = readRows_(CONFIG.SHEETS.MEMBERS).find(x => x.email === email); if (row) updateRow_(sh, row._row, COLS.MEMBERS, { last_pack: date }); }
}

function activeProducts_() { return readRows_(CONFIG.SHEETS.PRODUCTS).filter(p => String(p.active).toUpperCase() === 'TRUE').map(p => Object.assign(p, { type: String(p.type || 'download').toLowerCase() })); }

// ============================== 10. MORNING REPORT (08:00) ==============================
function morningReport() {
  return runJob_('morningReport', () => {
    const since = Date.now() - 86400000;
    const logs = readRows_(CONFIG.SHEETS.LOG).filter(l => new Date(l.time).getTime() > since);
    const errors = logs.filter(l => l.level === 'ERROR');
    const words = readRows_(CONFIG.SHEETS.WORDS);
    const wReview = words.filter(r => r.status === 'NEEDS_REVIEW');
    const pReview = readRows_(CONFIG.SHEETS.POSTS).filter(r => r.status === 'NEEDS_REVIEW');
    const subs = readRows_(CONFIG.SHEETS.SUBS).filter(s => s.status === 'ACTIVE');
    const members = readRows_(CONFIG.SHEETS.MEMBERS).filter(m => new Date(m.expires_at).getTime() > Date.now());
    const orders = readRows_(CONFIG.SHEETS.ORDERS).filter(o => o.delivered_at && new Date(o.delivered_at).getTime() > since);
    const queueLeft = Math.max(0, sheet_(CONFIG.SHEETS.QUEUE).getLastRow() - 1);
    const perExam = CONFIG.EXAMS.map(e => e + ' ' + subs.filter(s => s.exam === e).length).join(' · ');
    const html = `<div style="font-family:Arial,sans-serif;max-width:640px">
<h3 style="margin:0 0 6px">${errors.length ? '⚠ ' + errors.length + ' job error(s)' : 'All jobs ran'}</h3>
<p>Live words: <b>${words.filter(r => r.status === 'PUBLISHED').length}</b> · ready buffer: ${words.filter(r => r.status === 'APPROVED').length} · queue left: ${queueLeft}<br>
Subscribers: <b>${subs.length}</b> (${perExam})<br>Vault Pass members: <b>${members.length}</b> · orders in last 24 h: <b>${orders.length}</b> (₹${orders.reduce((a, o) => a + Number(o.amount_inr || 0), 0)})</p>
${pReview.length ? `<h4>Exam post(s) waiting for you — set status to APPROVED or REJECTED in ${CONFIG.SHEETS.POSTS}</h4><ul>${pReview.map(p => `<li>${fmtDate_(p.post_date)} ${p.exam}: ${esc_(p.issues)}</li>`).join('')}</ul>` : ''}
${wReview.length ? `<h4>${wReview.length} word(s) held back (they never go live unless you approve)</h4><ul>${wReview.slice(0, 10).map(r => `<li><b>${esc_(r.word)}</b>: ${esc_(r.issues)}</li>`).join('')}</ul>` : ''}
<h4>Last 24 h</h4><ul>${logs.map(l => `<li>[${l.level}] ${esc_(l.job)}: ${esc_(l.message)}</li>`).join('')}</ul>
${queueLeft < 300 ? `<p><b>Word queue is low.</b> Paste more words into ${CONFIG.SHEETS.QUEUE}, or the AI picks words itself.</p>` : ''}</div>`;
    MailApp.sendEmail({ to: prop_('OWNER_EMAIL'), subject: `VerbalVault: ${errors.length ? errors.length + ' error(s)' : 'OK'} · ${subs.length} subs · ₹${orders.reduce((a, o) => a + Number(o.amount_inr || 0), 0)} yesterday`, htmlBody: html });
    return 'Report sent.';
  });
}

// ============================== EMAIL (Brevo if set, else Gmail) ==============================
function emailBudgetLeft_() {
  const key = 'EMAILS_' + today_();
  const used = Number(props_().getProperty(key) || 0);
  if (used >= CONFIG.EMAIL_DAILY_LIMIT) return false;
  if (!prop_('BREVO_API_KEY', false) && MailApp.getRemainingDailyQuota() < 8) return false;
  return true;
}
function sendEmail_(m) {
  const key = 'EMAILS_' + today_();
  if (prop_('BREVO_API_KEY', false)) {
    const payload = { sender: { name: 'VerbalVaultPrep', email: prop_('BREVO_SENDER_EMAIL') }, to: [{ email: m.to }], subject: m.subject, htmlContent: m.html };
    if (m.attachments && m.attachments.length) payload.attachment = m.attachments.map(b => ({ name: b.getName(), content: Utilities.base64Encode(b.getBytes()) }));
    const res = UrlFetchApp.fetch('https://api.brevo.com/v3/smtp/email', { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), headers: { 'api-key': prop_('BREVO_API_KEY') }, muteHttpExceptions: true });
    if (res.getResponseCode() >= 300) throw new Error('Brevo ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 200));
  } else {
    MailApp.sendEmail({ to: m.to, subject: m.subject, htmlBody: m.html, name: 'VerbalVaultPrep', attachments: m.attachments || [] });
  }
  props_().setProperty(key, String(Number(props_().getProperty(key) || 0) + 1));
}
function brevoAccount_() {
  const r = UrlFetchApp.fetch('https://api.brevo.com/v3/account', { headers: { 'api-key': prop_('BREVO_API_KEY') }, muteHttpExceptions: true });
  if (r.getResponseCode() !== 200) throw new Error('Brevo ' + r.getResponseCode());
}
function packsFolder_() {
  const id = prop_('PACKS_FOLDER_ID', false);
  if (id) return DriveApp.getFolderById(id);
  const f = DriveApp.createFolder('VerbalVaultPrep Vault Pass packs (private)');
  props_().setProperty('PACKS_FOLDER_ID', f.getId());
  return f;
}

// ============================== HTTP HELPERS ==============================
function gemini_(prompt, temperature) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + CONFIG.GEMINI_MODEL + ':generateContent';
  const payload = { contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: temperature, responseMimeType: 'application/json' } };
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = UrlFetchApp.fetch(url, { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload), muteHttpExceptions: true, headers: { 'x-goog-api-key': prop_('GEMINI_API_KEY') } });
    const code = res.getResponseCode();
    if (code === 200) {
      const data = JSON.parse(res.getContentText());
      const parts = ((((data.candidates || [])[0] || {}).content || {}).parts) || [];
      const text = parts.filter(p => !p.thought).map(p => p.text || '').join('');
      const parsed = safeJson_(text.replace(/^\s*```(?:json)?/, '').replace(/```\s*$/, '').trim(), null);
      if (parsed) return parsed;
    } else if (code === 429 && /per.?day|PerDay|daily/i.test(res.getContentText())) {
      throw new Error('FREE_LIMIT: Gemini free daily limit reached');
    } else if (code !== 429 && code < 500) {
      throw new Error('Gemini ' + code + ': ' + res.getContentText().slice(0, 200));
    }
    Utilities.sleep((code === 429 ? 20000 : 3000) * attempt); // per-minute limit: wait and retry
  }
  throw new Error('Gemini gave no usable answer after 3 tries');
}
function github_(method, path, body) {
  const res = UrlFetchApp.fetch('https://api.github.com' + path, { method: method.toLowerCase(), muteHttpExceptions: true, contentType: 'application/json',
    payload: body ? JSON.stringify(body) : undefined,
    headers: { Authorization: 'Bearer ' + prop_('GITHUB_TOKEN'), Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' } });
  if (res.getResponseCode() >= 300) throw new Error('GitHub ' + res.getResponseCode() + ' ' + path + ': ' + res.getContentText().slice(0, 200));
  return JSON.parse(res.getContentText());
}
function telegram_(method, params) {
  const res = UrlFetchApp.fetch('https://api.telegram.org/bot' + prop_('TELEGRAM_BOT_TOKEN') + '/' + method, { method: 'post', payload: params, muteHttpExceptions: true });
  const data = JSON.parse(res.getContentText());
  if (!data.ok) throw new Error('Telegram ' + method + ': ' + data.description);
  return data.result;
}
function razorpay_(path) {
  const auth = Utilities.base64Encode(prop_('RAZORPAY_KEY_ID') + ':' + prop_('RAZORPAY_KEY_SECRET'));
  const res = UrlFetchApp.fetch('https://api.razorpay.com' + path, { headers: { Authorization: 'Basic ' + auth }, muteHttpExceptions: true });
  if (res.getResponseCode() >= 300) throw new Error('Razorpay ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 200));
  return JSON.parse(res.getContentText());
}

// ============================== SHEET + MISC HELPERS ==============================
/** lockKind 'doc' lets hourly generation run alongside the scheduled jobs (they never touch the same cells). */
function runJob_(name, fn, lockKind) {
  const lock = lockKind === 'doc' ? LockService.getDocumentLock() : LockService.getScriptLock();
  if (!lock.tryLock(lockKind === 'doc' ? 1000 : 240000)) { if (lockKind !== 'doc') log_(name, 'WARN', 'Another job was still running; skipped this run.'); return; }
  try { const msg = fn(); if (msg) log_(name, 'INFO', msg); return msg; }
  catch (err) {
    log_(name, 'ERROR', err.message);
    const k = 'ERRMAIL_' + name + '_' + today_(); // at most one alert email per job per day; the morning report lists the rest
    if (!props_().getProperty(k)) { try { MailApp.sendEmail(prop_('OWNER_EMAIL'), 'VerbalVault autopilot error: ' + name, err.stack || err.message); props_().setProperty(k, '1'); } catch (e) { /* ignore */ } }
  } finally { lock.releaseLock(); }
}
function sheet_(name) { const sh = SpreadsheetApp.getActive().getSheetByName(name); if (!sh) throw new Error('Sheet missing: ' + name + ' (run setupAutopilot)'); return sh; }
function ensureSheet_(name, headers) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  if (sh.getLastRow() === 0) { sh.appendRow(headers); sh.setFrozenRows(1); sh.getRange(1, 1, 1, headers.length).setFontWeight('bold'); }
  return sh;
}
function readRows_(name) {
  const sh = sheet_(name), last = sh.getLastRow();
  if (last < 2) return [];
  const vals = sh.getRange(1, 1, last, sh.getLastColumn()).getValues(), head = vals[0];
  return vals.slice(1).map((v, i) => { const o = { _row: i + 2 }; head.forEach((h, j) => o[h] = v[j]); return o; });
}
function appendRows_(name, cols, objs) {
  if (!objs.length) return;
  const sh = sheet_(name);
  const data = objs.map(o => cols.map(c => o[c] === undefined || o[c] === null ? '' : (Array.isArray(o[c]) ? o[c].join(' | ') : o[c])));
  sh.getRange(sh.getLastRow() + 1, 1, data.length, cols.length).setValues(data);
}
function updateRow_(sh, row, cols, patch) { Object.keys(patch).forEach(k => { const c = cols.indexOf(k); if (c >= 0) sh.getRange(row, c + 1).setValue(patch[k]); }); }
function log_(job, level, message) {
  try { ensureSheet_(CONFIG.SHEETS.LOG, COLS.LOG).appendRow([new Date(), job, level, String(message).slice(0, 500)]); } catch (e) { Logger.log(job + ' ' + level + ' ' + message); }
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function safeJson_(s, fallback) { if (Array.isArray(s) || (s && typeof s === 'object')) return s; try { return JSON.parse(s); } catch (e) { return fallback; } }
function slugify_(w) { return String(w).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80); }
function cap_(w) { w = String(w || ''); return w.charAt(0).toUpperCase() + w.slice(1); }
function esc_(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function fmtDate_(d) {
  if (!d) return '';
  if (Object.prototype.toString.call(d) === '[object Date]') return Utilities.formatDate(d, CONFIG.TIMEZONE, 'yyyy-MM-dd');
  return String(d).slice(0, 10);
}
