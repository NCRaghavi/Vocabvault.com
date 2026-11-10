import { getAllWords } from "@/lib/content";

// A small list of every word for the vault search box, generated at build time.
export const dynamic = "force-static";

export function GET() {
  const data = getAllWords().map((w) => [w.word, w.slug, w.definitionSnippet.slice(0, 90)]);
  return Response.json(data, { headers: { "Cache-Control": "public, max-age=3600" } });
}
