// src/utils/contentLoader.js
import matter from "gray-matter";

// Load articles
const articleFiles = import.meta.glob("/src/data/articles/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
export function loadArticles() {
  return Object.entries(articleFiles).map(([path, raw]) => {
    const { data, content } = matter(raw);
    const slug = path.split("/").pop().replace(".md", "");
    return { ...data, slug, content };
  });
}
export function getArticleById(id) {
  return loadArticles().find((a) => a.slug === id);
}

// Load blog posts
const blogFiles = import.meta.glob("/src/data/pages/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
export function loadBlogPosts() {
  return Object.entries(blogFiles).map(([path, raw]) => {
    const { data, content } = matter(raw);
    const slug = path.split("/").pop().replace(".md", "");
    return { ...data, slug, content };
  });
}
export function getBlogPostById(id) {
  return loadBlogPosts().find((b) => b.slug === id);
}

// Load books
const bookFiles = import.meta.glob("/src/data/books/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});
export function loadBooks() {
  return Object.entries(bookFiles).map(([path, raw]) => {
    const { data, content } = matter(raw);
    const slug = path.split("/").pop().replace(".md", "");
    return { ...data, slug, content };
  });
}
export function getBookById(id) {
  return loadBooks().find((b) => b.slug === id);
}
