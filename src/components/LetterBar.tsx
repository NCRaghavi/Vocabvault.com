import Link from "next/link";

export default function LetterBar({ active = "" }: { active?: string }) {
  return (
    <nav aria-label="Browse by letter" className="mt-6 flex flex-wrap gap-1.5">
      {"abcdefghijklmnopqrstuvwxyz".split("").map((l) => (
        <Link
          key={l}
          href={`/vault/${l}`}
          className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold border ${
            l === active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
          }`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
