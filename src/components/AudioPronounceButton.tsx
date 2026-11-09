"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface AudioPronounceButtonProps {
  word: string;
}

export default function AudioPronounceButton({ word }: AudioPronounceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePronounce = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech audio is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.85; // Slightly slower, scholarly cadence for clarity

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handlePronounce}
      title={`Listen to pronunciation of "${word}"`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        isPlaying
          ? "bg-blue-600 text-white shadow-inner"
          : "bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200"
      }`}
    >
      <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? "animate-pulse" : ""}`} />
      <span>{isPlaying ? "Pronouncing..." : "Listen"}</span>
    </button>
  );
}
