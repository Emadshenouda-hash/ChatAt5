// src/utils/contentLoader.js
import matter from "gray-matter";

// Vite glob import for markdown as raw text
const importMarkdown = import.meta.glob("/src/data/articles/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export async function loadArticles() {
  try {
    const articles = Object.entries(importMarkdown).map(([path, raw]) => {
      const { data: metadata, content } = matter(raw);
      const slug = path.split("/").pop().replace(".md", "");
      return {
        ...metadata,
        slug,
        content,
      };
    });

    return articles;
  } catch (err) {
    console.error("❌ Failed to load markdown articles.", err);
    return [];
  }
}
