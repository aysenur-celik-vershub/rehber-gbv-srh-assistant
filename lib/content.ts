import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { LANGUAGES, type Language } from "@/lib/types";

// Grounding content for the model. For the demo the whole vetted corpus of
// the selected language (a handful of short files) is passed as context on
// every request ("full context" approach). This module is the single entry
// point so that, as the corpus grows, the same signature can be backed by
// retrieval (RAG: embeddings + similarity search) without touching the rest
// of the app.

export type ContentDoc = {
  id: string;
  title: string;
  language: Language;
  reviewed: boolean;
  reviewer: string;
  lastUpdated: string;
  body: string;
  file: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content");

function readLanguage(lang: Language): ContentDoc[] {
  const dir = path.join(CONTENT_DIR, lang);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const parsed = matter(raw);
      const data = parsed.data as Record<string, unknown>;
      return {
        id: typeof data.id === "string" ? data.id : file.replace(/\.md$/, ""),
        title: typeof data.title === "string" ? data.title : file,
        language: lang,
        reviewed: data.reviewed === true,
        reviewer: typeof data.reviewer === "string" ? data.reviewer : "",
        lastUpdated: data.last_updated instanceof Date
          ? data.last_updated.toISOString().slice(0, 10)
          : String(data.last_updated ?? ""),
        body: parsed.content.trim(),
        file: `${lang}/${file}`,
      };
    });
}

// Read once when the module loads, not on every request.
const CACHE: Record<Language, ContentDoc[]> = Object.fromEntries(
  LANGUAGES.map((lang) => [lang, readLanguage(lang)]),
) as Record<Language, ContentDoc[]>;

export function getContentDocs(language: Language): ContentDoc[] {
  return CACHE[language];
}

export function getGroundingContent(language: Language): string {
  return CACHE[language].map((d) => `## ${d.title}\n${d.body}`).join("\n\n");
}
