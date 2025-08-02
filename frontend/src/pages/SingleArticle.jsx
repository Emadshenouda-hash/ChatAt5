// src/pages/SingleArticle.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getArticleById } from "@/utils/contentLoader";
import { LanguageContext } from "@/App";

const SingleArticle = () => {
  const { id } = useParams();
  const { language } = useContext(LanguageContext);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const data = getArticleById(id);
    if (data) setArticle(data);
  }, [id]);

  if (!article) {
    return (
      <p className="p-6">
        {language === "en" ? "Article not found." : "المقال غير موجود."}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold font-heading text-deep-plum mb-4">
        {article.title?.[language] || article.title}
      </h1>
      <p className="text-gray-600 text-sm mb-2">
        {article.date} – {article.author}
      </p>
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
};

export default SingleArticle;
