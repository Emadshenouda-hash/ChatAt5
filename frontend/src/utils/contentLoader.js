import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

// Static fallback JSON (used if Netlify Functions fail)
import staticArticles from "../data/articles.json";
import staticBlog from "../data/blog.json";
import staticBooks from "../data/books.json";

// ✅ Corrected glob path: this will now work in production
const articleFiles = import.meta.glob("../data/articles/*.md", {
  as: "raw",
  eager: true,
});

const blogFiles = import.meta.glob("../data/blog/*.md", {
  as: "raw",
  eager: true,
});

const bookFiles = import.meta.glob("../data/books/*.md", {
  as: "raw",
  eager: true,
});

function generateIdFromPath(path) {
  const filename = path.split("/").pop().replace(".md", "");
  let hash = 0;
  for (let i = 0; i < filename.length; i++) {
    const char = filename.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Parse markdown frontmatter + body
function parseMarkdown(fileContent, path) {
  const { data, content } = matter(fileContent);
  return {
    id: generateIdFromPath(path),
    ...data,
    content,
  };
}

// Articles
export async function loadArticles() {
  try {
    const articles = Object.entries(articleFiles).map(([path, fileContent]) =>
      parseMarkdown(fileContent, path)
    );
    return articles;
  } catch (err) {
    console.warn(
      "Failed to load markdown articles. Using static fallback.",
      err
    );
    return staticArticles;
  }
}

// Blog Posts
export async function loadBlogPosts() {
  try {
    const posts = Object.entries(blogFiles).map(([path, fileContent]) =>
      parseMarkdown(fileContent, path)
    );
    return posts;
  } catch (err) {
    console.warn(
      "Failed to load markdown blog posts. Using static fallback.",
      err
    );
    return staticBlog;
  }
}

// Books
export async function loadBooks() {
  try {
    const books = Object.entries(bookFiles).map(([path, fileContent]) =>
      parseMarkdown(fileContent, path)
    );
    return books;
  } catch (err) {
    console.warn("Failed to load markdown books. Using static fallback.", err);
    return staticBooks;
  }
}

// Get one item by ID
export async function getArticleById(id) {
  const articles = await loadArticles();
  return articles.find((a) => a.id === parseInt(id));
}

export async function getBlogPostById(id) {
  const posts = await loadBlogPosts();
  return posts.find((p) => p.id === parseInt(id));
}

export async function getBookById(id) {
  const books = await loadBooks();
  return books.find((b) => b.id === parseInt(id));
}
