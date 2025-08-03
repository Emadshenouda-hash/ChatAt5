// src/pages/Articles.jsx
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "@/App";
import { Button } from "@/components/ui/button";

// Use Vite's glob to import all markdown articles
const articlesGlob = import.meta.glob("/src/content/articles/*.md", {
  eager: true,
});

// Normalize the data from the glob import and create an array of articles
const allArticles = Object.entries(articlesGlob).map(([path, module]) => {
  const slug = path.split("/").pop().replace(".md", "");
  return {
    slug,
    ...module.frontmatter,
  };
});

const Articles = () => {
  const { language, t } = useContext(LanguageContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Filter articles by the current language
    const filteredArticles = allArticles.filter(
      (article) => article.lang === language
    );
    setArticles(filteredArticles);
    setLoading(false);
  }, [language]);

  const pageT = t?.nav?.articles || { title: "Articles" };
  const noArticlesText =
    language === "en" ? "No articles available." : "لا توجد مقالات.";

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-plum mb-8 font-heading text-center">
          {pageT.title}
        </h1>

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600 font-primary">
              {language === "en" ? "Loading..." : "جاري التحميل..."}
            </p>
          </div>
        ) : articles.length === 0 ? (
          <p className="text-center text-gray-500 font-primary">
            {noArticlesText}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <div
                key={article.slug}
                className="border border-gray-200 p-4 rounded-2xl shadow-md bg-white"
              >
                <h2 className="text-2xl font-semibold text-deep-plum mb-2 font-heading">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4 font-primary">
                  {article.description}
                </p>
                <Link to={`/articles/${article.slug}`}>
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
