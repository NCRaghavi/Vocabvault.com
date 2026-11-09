"use client";

import { useEffect, useRef, useState } from "react";
import { QuizData } from "@/lib/content";
import {
  Clock,
  Award,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Play,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";

interface CbtQuizEngineProps {
  quizData: QuizData;
}

export default function CbtQuizEngine({ quizData }: CbtQuizEngineProps) {
  // Store quiz state to support both React hydration and custom Vanilla JS manipulation
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Initialize Custom Vanilla JavaScript Quiz Engine binding to DOM IDs
    const startScreen = document.getElementById("quiz-start-screen");
    const activeScreen = document.getElementById("quiz-active-screen");
    const summaryScreen = document.getElementById("quiz-summary-screen");
    const timerElement = document.getElementById("quiz-timer");
    const questionCounter = document.getElementById("question-counter");
    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const nextBtn = document.getElementById("next-btn") as HTMLButtonElement | null;
    const startBtn = document.getElementById("start-btn") as HTMLButtonElement | null;
    const restartBtn = document.getElementById("restart-btn") as HTMLButtonElement | null;
    const scoreDisplay = document.getElementById("score-display");
    const reviewContainer = document.getElementById("review-container");

    if (!startScreen || !activeScreen || !summaryScreen || !timerElement || !questionCounter) {
      return;
    }

    let currentIndex = 0;
    let selectedOption: number | null = null;
    let score = 0;
    let timerInterval: any = null;
    let timeLeft = quizData.timePerQuestionSeconds || 45;
    const userAnswers: { selected: number | null; correct: boolean; timeUsed: number }[] = [];

    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }

    function startTimer() {
      stopTimer();
      timeLeft = quizData.timePerQuestionSeconds || 45;
      updateTimerUI();

      timerInterval = setInterval(() => {
        timeLeft -= 1;
        updateTimerUI();

        if (timeLeft <= 0) {
          stopTimer();
          // Auto advance on timeout
          handleAnswer(-1); // -1 means timed out
          setTimeout(() => {
            advanceQuestion();
          }, 800);
        }
      }, 1000);
    }

    function updateTimerUI() {
      if (!timerElement) return;
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      const formatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
      
      timerElement.textContent = formatted;

      if (timeLeft <= 10) {
        timerElement.className = "font-mono text-xl font-bold text-rose-600 animate-pulse";
      } else {
        timerElement.className = "font-mono text-xl font-bold text-blue-700";
      }
    }

    function renderQuestion(index: number) {
      const q = quizData.questions[index];
      selectedOption = null;

      if (questionCounter) {
        questionCounter.innerHTML = `Question <span class="font-bold text-slate-900">${index + 1}</span> of <span class="font-bold text-slate-900">${quizData.questions.length}</span>`;
      }

      if (questionText) {
        questionText.textContent = q.prompt;
      }

      if (optionsContainer) {
        optionsContainer.innerHTML = "";
        q.options.forEach((opt, optIndex) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className =
            "w-full text-left p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-blue-300 transition-all flex items-center justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20";
          btn.setAttribute("data-option-index", String(optIndex));

          const letter = String.fromCharCode(65 + optIndex);
          btn.innerHTML = `
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-700 group-hover:text-blue-700 flex items-center justify-center font-mono font-bold text-xs transition-colors">
                ${letter}
              </span>
              <span class="text-sm sm:text-base font-medium text-slate-800">${opt}</span>
            </div>
            <div class="w-4 h-4 rounded-full border border-slate-300 group-hover:border-blue-400 transition-colors"></div>
          `;

          btn.addEventListener("click", () => {
            handleAnswer(optIndex);
          });

          optionsContainer.appendChild(btn);
        });
      }

      if (nextBtn) {
        nextBtn.disabled = true;
        nextBtn.className =
          "px-6 py-3 rounded-xl bg-slate-200 text-slate-400 font-bold text-sm cursor-not-allowed transition-all";
        nextBtn.textContent = index === quizData.questions.length - 1 ? "Submit & View Results" : "Next Question →";
      }

      startTimer();
    }

    function handleAnswer(optIndex: number) {
      selectedOption = optIndex;
      const q = quizData.questions[currentIndex];

      if (optionsContainer) {
        const optionButtons = optionsContainer.querySelectorAll("button");
        optionButtons.forEach((b, idx) => {
          if (idx === optIndex) {
            b.className =
              "w-full text-left p-4 rounded-xl border-2 border-blue-600 bg-blue-50/70 shadow-sm flex items-center justify-between";
            const radio = b.querySelector("div:last-child");
            if (radio) {
              radio.className = "w-4 h-4 rounded-full bg-blue-600 ring-2 ring-blue-200";
            }
          } else {
            b.className =
              "w-full text-left p-4 rounded-xl border border-slate-200 bg-white opacity-60 flex items-center justify-between";
          }
        });
      }

      if (nextBtn) {
        nextBtn.disabled = false;
        nextBtn.className =
          "px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer";
      }
    }

    function advanceQuestion() {
      stopTimer();
      const q = quizData.questions[currentIndex];
      const isCorrect = selectedOption === q.correctIndex;
      if (isCorrect) score += 1;

      userAnswers.push({
        selected: selectedOption,
        correct: isCorrect,
        timeUsed: (quizData.timePerQuestionSeconds || 45) - timeLeft,
      });

      if (currentIndex < quizData.questions.length - 1) {
        currentIndex += 1;
        renderQuestion(currentIndex);
      } else {
        showFinalSummary();
      }
    }

    function showFinalSummary() {
      stopTimer();
      if (activeScreen) activeScreen.style.display = "none";
      if (summaryScreen) summaryScreen.style.display = "block";

      const total = quizData.questions.length;
      const pct = Math.round((score / total) * 100);
      const passed = pct >= quizData.passingScorePercentage;

      if (scoreDisplay) {
        scoreDisplay.innerHTML = `
          <div class="text-center py-4">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full ${
              passed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            } mb-4">
              <span class="text-2xl font-extrabold font-mono">${pct}%</span>
            </div>
            <h3 class="text-2xl font-extrabold text-slate-900">
              ${passed ? "CBT Diagnostic Passed!" : "Diagnostic Complete — Review Recommended"}
            </h3>
            <p class="text-sm text-slate-600 mt-1">
              You scored <span class="font-bold text-slate-900">${score}</span> out of <span class="font-bold text-slate-900">${total}</span> (${pct}%)
            </p>
            <div class="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
              passed ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"
            }">
              <span>${passed ? "Target Percentile: 85th - 99th" : "Focus on high-frequency root pairs"}</span>
            </div>
          </div>
        `;
      }

      if (reviewContainer) {
        reviewContainer.innerHTML = "";
        quizData.questions.forEach((q, idx) => {
          const userAns = userAnswers[idx];
          const isCorrect = userAns ? userAns.correct : false;
          const userChoiceText = userAns && userAns.selected !== null && userAns.selected >= 0 ? q.options[userAns.selected] : "Timed Out";
          const correctText = q.options[q.correctIndex];

          const itemDiv = document.createElement("div");
          itemDiv.className = `p-5 rounded-2xl border ${
            isCorrect ? "border-emerald-200 bg-emerald-50/40" : "border-rose-200 bg-rose-50/40"
          } space-y-2 text-left`;

          itemDiv.innerHTML = `
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="font-bold text-slate-800">Item ${idx + 1} • ${q.type}</span>
              <span class="font-bold ${isCorrect ? "text-emerald-700" : "text-rose-700"}">
                ${isCorrect ? "✓ Correct (+100 pts)" : "✗ Incorrect"}
              </span>
            </div>
            <p class="text-sm font-medium text-slate-900 leading-snug">${q.prompt}</p>
            <div class="text-xs pt-1 space-y-1">
              <p class="text-slate-600">Your choice: <span class="font-semibold ${isCorrect ? "text-emerald-800" : "text-rose-800"}">${userChoiceText}</span></p>
              ${!isCorrect ? `<p class="text-slate-600">Correct answer: <span class="font-semibold text-emerald-800">${correctText}</span></p>` : ""}
            </div>
            <div class="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-600 bg-white/70 p-3 rounded-xl leading-relaxed">
              <strong class="text-slate-800">Lexical Rationale:</strong> ${q.explanation}
            </div>
          `;

          reviewContainer.appendChild(itemDiv);
        });
      }
    }

    function startQuiz() {
      currentIndex = 0;
      score = 0;
      userAnswers.length = 0;
      if (startScreen) startScreen.style.display = "none";
      if (summaryScreen) summaryScreen.style.display = "none";
      if (activeScreen) activeScreen.style.display = "block";
      renderQuestion(0);
    }

    function restartQuiz() {
      if (summaryScreen) summaryScreen.style.display = "none";
      if (activeScreen) activeScreen.style.display = "none";
      if (startScreen) startScreen.style.display = "block";
      stopTimer();
    }

    // Event Listeners
    if (startBtn) {
      startBtn.onclick = startQuiz;
    }
    if (nextBtn) {
      nextBtn.onclick = advanceQuestion;
    }
    if (restartBtn) {
      restartBtn.onclick = restartQuiz;
    }

    return () => {
      stopTimer();
    };
  }, [quizData]);

  return (
    <div className="w-full">
      {/* ========================================================
          CENTERED CLEAN BORDERED UI CARD HOUSING THE QUIZ ENGINE
          ======================================================== */}
      <div
        id="cbt-quiz-card"
        className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-10 transition-all"
      >
        {/* ========================================================
            PLACEHOLDER DIV 1: START SCREEN (id="quiz-start-screen")
            ======================================================== */}
        <div id="quiz-start-screen" className="space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 mb-2 shadow-inner">
            <Zap className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Computer-Based Test Simulation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
              {quizData.examTitle}
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              {quizData.subtitle}
            </p>
          </div>

          {/* Test Parameters */}
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-xs font-mono text-slate-400 block">Questions</span>
              <span className="text-lg font-bold text-slate-800">{quizData.questions.length}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-xs font-mono text-slate-400 block">Per Question</span>
              <span className="text-lg font-bold text-slate-800">{quizData.timePerQuestionSeconds}s</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl">
              <span className="text-xs font-mono text-slate-400 block">Pass Target</span>
              <span className="text-lg font-bold text-emerald-600">{quizData.passingScorePercentage}%</span>
            </div>
          </div>

          {/* Rules & Instructions */}
          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 border border-slate-100 text-xs text-slate-600">
            <div className="font-bold text-slate-800 flex items-center gap-1.5 uppercase font-mono">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              CBT Simulation Guidelines:
            </div>
            <ul className="list-disc pl-5 space-y-1">
              {quizData.instructions.map((inst, idx) => (
                <li key={idx}>{inst}</li>
              ))}
            </ul>
          </div>

          {/* Start Button */}
          <button
            id="start-btn"
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base shadow-lg shadow-blue-700/20 hover:shadow-blue-700/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Begin Master CBT Challenge</span>
          </button>
        </div>

        {/* =========================================================================
            PLACEHOLDER DIV 2: ACTIVE QUIZ SCREEN (id="quiz-active-screen")
            Contains:
            - Visible Countdown Timer (id="quiz-timer")
            - Question Counter (id="question-counter")
            - Question text and options container
            ========================================================================= */}
        <div id="quiz-active-screen" style={{ display: "none" }} className="space-y-6">
          {/* Header Bar with Question Counter & Visible Countdown Timer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            {/* Question Counter Element */}
            <div
              id="question-counter"
              className="text-xs sm:text-sm font-medium text-slate-500 font-mono"
            >
              Question 1 of {quizData.questions.length}
            </div>

            {/* Visible Countdown Timer Element */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
              <Clock className="w-4 h-4 text-slate-500" />
              <div id="quiz-timer" className="font-mono text-lg font-bold text-blue-700">
                00:{String(quizData.timePerQuestionSeconds || 45).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Question Prompt Area */}
          <div className="py-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Read carefully and select the best response:
            </span>
            <p
              id="question-text"
              className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed font-serif"
            >
              Loading question...
            </p>
          </div>

          {/* Dynamic Options Container */}
          <div id="options-container" className="space-y-3">
            {/* Populated dynamically by Custom JS Quiz Engine */}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Auto-advances on timer expiry
            </span>
            <button
              id="next-btn"
              type="button"
              disabled
              className="px-6 py-3 rounded-xl bg-slate-200 text-slate-400 font-bold text-sm cursor-not-allowed transition-all"
            >
              Next Question →
            </button>
          </div>
        </div>

        {/* =========================================================================
            PLACEHOLDER DIV 3: FINAL SCORE SUMMARY SCREEN (id="quiz-summary-screen")
            ========================================================================= */}
        <div id="quiz-summary-screen" style={{ display: "none" }} className="space-y-6">
          {/* Score Calculation & Performance Display */}
          <div id="score-display">
            {/* Populated dynamically by Custom JS Quiz Engine */}
          </div>

          {/* Question-by-Question Review with Explanations */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Performance & Lexical Rationale Review
            </h4>
            <div id="review-container" className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {/* Populated dynamically by Custom JS Quiz Engine */}
            </div>
          </div>

          {/* Retake Challenge Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              id="restart-btn"
              type="button"
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Diagnostic Challenge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
