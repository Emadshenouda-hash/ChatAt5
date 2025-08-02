// src/utils/contentLoader.js

const articleFiles = import.meta.glob("../data/articles/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const blogFiles = import.meta.glob("../data/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

const bookFiles = import.meta.glob("../data/books/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Utility function to parse frontmatter
function parseMetadata(content) {
  const match = content.match(/---\n([\s\S]*?)\n---/);
  const metadata = {};

  if (match) {
    match[1].split("\n").forEach((line) => {
      const [key, value] = line.split(":").map((s) => s.trim());
      metadata[key] = value;
    });
  }

  return metadata;
}

// Load all articles
export function loadArticles() {
  return Object.entries(articleFiles).map(([path, content]) => {
    const id = path.split("/").pop().replace(".md", "");
    const metadata = parseMetadata(content);

    return {
      id,
      ...metadata,
      content,
    };
  });
}

// Load single article by ID
export function getArticleById(id) {
  const matchEntry = Object.entries(articleFiles).find(([path]) =>
    path.includes(`${id}.md`)
  );

  if (!matchEntry) return null;

  const [path, content] = matchEntry;
  const metadata = parseMetadata(content);

  return {
    id,
    ...metadata,
    content: content.replace(/---\n[\s\S]*?\n---/, ""), // Remove frontmatter
  };
}

// Load blog posts
export function loadBlogPosts() {
  return Object.entries(blogFiles).map(([path, content]) => {
    const id = path.split("/").pop().replace(".md", "");
    const metadata = parseMetadata(content);

    return {
      id,
      ...metadata,
      content,
    };
  });
}

// Load single blog post
export function getBlogPostById(id) {
  return loadBlogPosts().find((p) => p.id === id);
}

// Load books
export function loadBooks() {
  return Object.entries(bookFiles).map(([path, content]) => {
    const id = path.split("/").pop().replace(".md", "");
    const metadata = parseMetadata(content);

    return {
      id,
      ...metadata,
      content,
    };
  });
}

// Load single book
export function getBookById(id) {
  return loadBooks().find((b) => b.id === id);
}
