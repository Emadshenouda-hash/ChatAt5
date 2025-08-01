import matter from "gray-matter";

// Fallback static JSON (for blog + books)
import staticBlog from "../data/blog.json";
import staticBooks from "../data/books.json";

// ✅ LOAD ARTICLES from Markdown
export function loadArticles() {
  const files = import.meta.glob("/src/data/articles/*.md", {
    as: "raw",
    eager: true,
  });

  return Object.entries(files)
    .map(([path, raw]) => {
      const { data: metadata } = matter(raw);
      const slug = path.split("/").pop().replace(".md", "");

      return {
        id: slug,
        title: {
          en: metadata.language === "en" ? metadata.title : "",
          ar: metadata.language === "ar" ? metadata.title : "",
        },
        excerpt: {
          en: metadata.language === "en" ? metadata.excerpt : "",
          ar: metadata.language === "ar" ? metadata.excerpt : "",
        },
        date: metadata.date,
        author: metadata.author,
        image: metadata.image,
        language: metadata.language,
        category: metadata.category,
        tags: metadata.tags,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// ✅ LOAD BLOG POSTS (fallback)
export async function loadBlogPosts() {
  try {
    const response = await fetch("/.netlify/functions/get-content?type=blog");
    if (response.ok) {
      const blogPosts = await response.json();
      return blogPosts;
    }
  } catch (error) {
    console.warn("Failed to fetch blog posts from Netlify function:", error);
  }
  return staticBlog;
}

// ✅ LOAD BOOKS (fallback)
export async function loadBooks() {
  try {
    const response = await fetch("/.netlify/functions/get-content?type=books");
    if (response.ok) {
      const books = await response.json();
      return books;
    }
  } catch (error) {
    console.warn("Failed to fetch books from Netlify function:", error);
  }
  return staticBooks;
}

// ✅ GET SINGLE ARTICLE BY ID
export function getArticleById(id) {
  const articles = loadArticles();
  return articles.find((article) => article.id === id);
}

// ✅ GET SINGLE BLOG POST BY ID
export async function getBlogPostById(id) {
  const blogPosts = await loadBlogPosts();
  return blogPosts.find((post) => post.id === parseInt(id));
}

// ✅ GET SINGLE BOOK BY ID
export async function getBookById(id) {
  const books = await loadBooks();
  return books.find((book) => book.id === parseInt(id));
}
