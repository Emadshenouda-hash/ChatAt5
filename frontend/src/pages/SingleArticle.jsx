// src/pages/SingleArticle.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getArticleById } from "@/utils/contentLoader";
import { LanguageContext } from "@/App";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const SingleArticle = () => {
  const { id } = useParams();
  const { language } = useContext(LanguageContext);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      const data = await getArticleById(id);
      if (data) setArticle(data);
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <p className="p-6 text-center text-lg">
        {language === "en" ? "Loading..." : "جاري التحميل..."}
      </p>
    );
  }

  if (!article) {
    return (
      <p className="p-6 text-center text-lg text-gray-500">
        {language === "en" ? "Article not found." : "المقال غير موجود."}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-12">
      <h1 className="text-3xl font-bold font-heading text-deep-plum mb-4">
        {article.title?.[language] || article.title}
      </h1>
      <p className="text-gray-600 text-sm mb-4">
        {article.date} – {article.author}
      </p>
      {/*
        Using ReactMarkdown to safely render the article content from the fetched Markdown.
        The `remarkGfm` plugin adds support for GitHub Flavored Markdown (tables, task lists, etc.).
      */}
      <div className="prose max-w-none font-primary">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default SingleArticle;
