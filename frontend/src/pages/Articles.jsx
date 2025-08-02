import React, { useContext } from "react";
import { LanguageContext } from "@/App";
import { loadArticles } from "@/utils/contentLoader";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Articles = () => {
  const { language, t } = useContext(LanguageContext);
  const articles = loadArticles();
  const filtered = articles.filter((a) => a.language === language);

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-plum mb-8 font-heading">
          {t.nav.articles}
        </h1>

        {filtered.length === 0 ? (
          <p>No articles available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((article) => (
              <div
                key={article.id}
                className="border border-gray-200 p-4 rounded shadow-md"
              >
                <h2 className="text-2xl font-semibold text-sky-teal font-heading">
                  {article.title?.[language] || article.title}
                </h2>
                <p className="text-gray-600 mb-2 text-sm">
                  {article.date} – {article.author}
                </p>
                <p className="text-gray-800 font-primary mb-4">
                  {article.excerpt?.[language] ||
                    article.content?.slice(0, 120)}
                </p>
                <Link to={`/articles/${article.id}`}>
                  <Button className="bg-serene-blue text-white hover:bg-deep-plum font-primary">
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
