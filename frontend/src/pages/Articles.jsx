import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "@/App";
import { Button } from "@/components/ui/button";

// Use Vite's import.meta.glob to dynamically import all Markdown articles.
// This loads the frontmatter and HTML content directly.
const articlesGlob = import.meta.glob("/src/data/articles/*.md", {
  eager: true,
});

const Articles = () => {
  const { language, t } = useContext(LanguageContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Extract the articles from the glob import.
      const allArticles = Object.entries(articlesGlob).map(([path, module]) => {
        // Create a unique ID from the filename.
        const id = path.split("/").pop().replace(".md", "");
        return {
          id,
          // Extract data from the frontmatter.
          ...module.frontmatter,
        };
      });

      // Filter articles based on the current language (using 'language' as per config.yml).
      const filtered = allArticles.filter((a) => a.language === language);
      setArticles(filtered);
    } catch (err) {
      console.error("Error loading articles:", err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [language]);

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-plum mb-8 font-heading">
          {t?.nav?.articles || "Articles"}
        </h1>

        {loading ? (
          <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
        ) : articles.length === 0 ? (
          <p>
            {language === "en" ? "No articles available." : "لا توجد مقالات."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                className="border border-gray-200 p-4 rounded-2xl shadow-md bg-white"
              >
                <h2 className="text-2xl font-semibold text-sky-teal font-heading">
                  {/* The title from the frontmatter is used directly. */}
                  {article.title || "Untitled"}
                </h2>
                <p className="text-gray-600 mb-2 text-sm">
                  {article.date || "Unknown date"} –{" "}
                  {article.author || "Unknown"}
                </p>
                <p className="text-gray-800 font-primary mb-4">
                  {/* Use the excerpt from the frontmatter, or a slice of the body as a fallback. */}
                  {article.excerpt || article.body?.slice(0, 120) + "..."}
                </p>
                <Link to={`/articles/${article.id}`}>
                  <Button className="bg-serene-blue text-white hover:bg-deep-plum font-primary transition-all duration-300 shadow-md">
                    {language === "en" ? "Read More" : "اقرأ المزيد"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
