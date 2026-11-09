interface AdSlotProps {
  type: "leaderboard" | "sidebar" | "in-article" | "footer";
  className?: string;
}

export default function AdSlot({ type, className = "" }: AdSlotProps) {
  const heights = {
    leaderboard: "h-[90px] sm:h-[100px]",
    sidebar: "h-[250px] sm:h-[300px]",
    "in-article": "h-[120px] sm:h-[140px]",
    footer: "h-[100px] sm:h-[120px]",
  };

  const labels = {
    leaderboard: "Leaderboard Ad Slot (728x90 / Responsive)",
    sidebar: "Display Sidebar Ad Slot (300x250 / Sticky)",
    "in-article": "In-Content Native Ad Placement (Responsive)",
    footer: "Bottom Anchor Ad Placement (Responsive)",
  };

  return (
    <aside
      aria-label="Advertisement Placement"
      className={`relative w-full rounded-2xl border border-dashed border-slate-300 bg-slate-100/60 p-4 flex flex-col items-center justify-center text-center transition-colors hover:bg-slate-100/90 ${heights[type]} ${className}`}
    >
      <span className="absolute top-2 right-3 text-[9px] uppercase font-mono tracking-widest text-slate-400 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
        ADVERTISEMENT
      </span>
      <div className="flex flex-col items-center gap-1 text-slate-400">
        <span className="text-xs font-mono font-medium">{labels[type]}</span>
        <span className="text-[10px] text-slate-400">
          Reserved high-whitespace layout slot • Zero CLS guaranteed
        </span>
      </div>
    </aside>
  );
}
