// src/utils/contentLoader.js

/**
 * Parses the frontmatter from a Markdown string.
 * Assumes frontmatter is enclosed between '---' at the beginning of the file.
 * @param {string} markdown - The raw Markdown content.
 * @returns {{frontmatter: object, body: string}}
 */
function parseMarkdown(markdown) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = frontmatterRegex.exec(markdown);

  if (!match) {
    return { frontmatter: {}, body: markdown };
  }

  const frontmatterStr = match[1];
  const body = markdown.substring(match[0].length).trim();
  const frontmatter = {};

  frontmatterStr.split("\n").forEach((line) => {
    const parts = line.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join(":").trim();
      // Try to parse numbers, booleans, and arrays from the string
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (!isNaN(Number(value)) && value.trim() !== "") {
        value = Number(value);
      } else if (value.toLowerCase() === "true") {
        value = true;
      } else if (value.toLowerCase() === "false") {
        value = false;
      } else if (value.startsWith("[") && value.endsWith("]")) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch (e) {
          // If parsing fails, keep it as a string
          console.error(`Could not parse array for key ${key}: ${value}`, e);
        }
      }
      frontmatter[key] = value;
    }
  });

  return { frontmatter, body };
}

/**
 * Fetches and parses all articles from the /src/data/articles directory.
 * @returns {Promise<Array<{id: string, ...frontmatter, content: string}>>}
 */
export async function loadArticles() {
  const articleFiles = [
    // This array should be populated with the paths to all your article files.
    // Replace with your actual filenames.
    "2025-07-31-another-test.md",
  ];

  const articles = await Promise.all(
    articleFiles.map(async (fileName) => {
      try {
        const response = await fetch(`/src/data/articles/${fileName}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch article: ${fileName}`);
        }
        const markdown = await response.text();
        const { frontmatter, body } = parseMarkdown(markdown);
        return {
          id: fileName.replace(".md", ""),
          ...frontmatter,
          content: body,
        };
      } catch (error) {
        console.error(`Error loading article ${fileName}:`, error);
        return null;
      }
    })
  );

  return articles.filter(Boolean); // Filter out any failed loads
}

/**
 * Fetches a single article by its ID.
 * @param {string} id - The ID of the article (filename without extension).
 * @returns {Promise<{id: string, ...frontmatter, content: string}|null>}
 */
export async function getArticleById(id) {
  try {
    const response = await fetch(`/src/data/articles/${id}.md`);
    if (!response.ok) {
      throw new Error(`Failed to fetch article with ID: ${id}`);
    }
    const markdown = await response.text();
    const { frontmatter, body } = parseMarkdown(markdown);
    return {
      id,
      ...frontmatter,
      content: body,
    };
  } catch (error) {
    console.error(`Error loading article ${id}:`, error);
    return null;
  }
}

// NOTE: You will need to manually update the `articleFiles` array
// with the filenames of all your Markdown articles.
