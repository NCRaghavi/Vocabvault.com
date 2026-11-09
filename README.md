# VerbalVaultPrep 🎓

A fast-loading, highly optimized academic test-prep website and headless lexical engine built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**.

VerbalVaultPrep is specifically engineered for international students preparing for standardized graduate and English proficiency exams, featuring dynamic Computer-Based Testing (CBT) modules, root etymology, and mnemonic retention anchors.

---

## 🚀 Features

- **The Weekly Master CBT Challenge**:
  - Interactive timed simulations for **GRE**, **GMAT Focus**, **IELTS Academic**, **TOEFL iBT**, **Digital SAT**, and **Pearson Test of English (PTE Academic)**.
  - Custom JavaScript CBT quiz engine featuring a visible countdown timer, question counter, auto-advance on timeout, and comprehensive performance review with question-by-question lexical rationales.
- **Headless Content Engine**:
  - Word entries powered by structured Markdown files with YAML frontmatter (`src/content/words/*.md`).
  - Quizzes and question banks powered by JSON schema (`src/content/quizzes/*.json`).
- **Standardized Word Template (`/words/[slug]`)**:
  - H1 heading and Web Speech API audio pronunciation.
  - 5 distinct content blocks: **Definition**, **In Context (Sentence)**, **Synonyms**, **Antonyms**, and **Memory Trick (Mnemonic + Greek/Latin root analysis)**.
  - Pre-allocated zero-CLS ad whitespace slots (`.ad-leaderboard`, `.ad-sidebar`, `.ad-in-article`, `.ad-footer`).
- **SEO & Structured Data**:
  - OpenGraph cards, dynamic meta descriptions, and Schema.org `DefinedTerm` JSON-LD markup.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **Content Parser**: Gray-Matter (Markdown frontmatter)

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📄 License
MIT License. Built for international academic excellence.
