// src/lib/contentLoader.js

// Import only in Vite context
const importMarkdown = import.meta.glob("/src/data/articles/*.md", {
  eager: true,
});

export async function loadArticles() {
  try {
    const articles = Object.entries(importMarkdown).map(([path, module]) => {
      const slug = path.split("/").pop().replace(".md", "");
      return {
        ...module.metadata,
        slug,
        content: module.default,
      };
    });

    return articles;
  } catch (err) {
    console.error("❌ Failed to load markdown articles.", err);
    return []; // Prevent filter/map errors
  }
}
