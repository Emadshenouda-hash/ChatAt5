// src/pages/SingleArticle.jsx
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LanguageContext } from "@/App.jsx";

// Use Vite's glob to import all markdown articles
const articlesGlob = import.meta.glob("/src/content/articles/*.md", {
  eager: true,
});

const SingleArticle = () => {
  const { slug } = useParams();
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const articleModule = articlesGlob[`/src/content/articles/${slug}.md`];

    if (!articleModule || articleModule.frontmatter.lang !== language) {
      // If no article found or language doesn't match, redirect
      navigate("/articles", { replace: true });
      return;
    }

    const { frontmatter, html } = articleModule;
    setArticle({
      ...frontmatter,
      content: html,
    });
    setLoading(false);
  }, [slug, language, navigate]);

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
    return null; // The navigate function handles the case where the article isn't found
  }

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-deep-plum mb-4 font-heading">
            {article.title}
          </h1>
          <p className="text-gray-600 mb-6 font-primary">
            {article.description}
          </p>
          <hr className="my-6" />
          <div className="prose max-w-none">
            {/* The HTML is already parsed from the glob import */}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleArticle;
