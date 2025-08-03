import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LanguageContext } from "@/App";

// Use Vite's glob again to load the articles, this time to find the specific one.
const articlesGlob = import.meta.glob("/src/data/articles/*.md", {
  eager: true,
});

const SingleArticle = () => {
  const { id } = useParams();
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Find the article module based on the URL parameter 'id'.
    const articleModule = articlesGlob[`/src/data/articles/${id}.md`];

    // If the article is not found or the language doesn't match, redirect.
    if (!articleModule || articleModule.frontmatter.language !== language) {
      navigate("/articles", { replace: true });
      return;
    }

    // Set the article data from the frontmatter and the HTML body.
    setArticle({
      ...articleModule.frontmatter,
      content: articleModule.body,
    });
    setLoading(false);
  }, [id, language, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 bg-ivory-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-deep-plum border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return null; // Navigation handles the case where the article isn't found.
  }

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-deep-plum mb-4 font-heading">
            {article.title}
          </h1>
          <p className="text-gray-600 mb-2 text-sm">
            {article.date || "Unknown date"} – {article.author || "Unknown"}
          </p>
          <hr className="my-6" />
          {article.image && (
            <div className="mb-6">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-auto rounded-xl shadow-md"
              />
            </div>
          )}
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default SingleArticle;
