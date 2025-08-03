// src/components/DynamicContentDetail.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// A utility function to format the date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const DynamicContentDetail = ({ type, content, language }) => {
  const [ReactMarkdown, setReactMarkdown] = useState(null);
  const [rehypeRaw, setRehypeRaw] = useState(null);

  useEffect(() => {
    // Dynamically import the libraries
    const loadMarkdownLibraries = async () => {
      try {
        const markdown = await import("react-markdown");
        const rehype = await import("rehype-raw");
        setReactMarkdown(() => markdown.default);
        setRehypeRaw(() => rehype.default);
      } catch (error) {
        console.error("Failed to load markdown libraries:", error);
      }
    };

    loadMarkdownLibraries();
  }, []);

  // Check if content exists before trying to access its properties
  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">
          {language === "ar"
            ? "لم يتم العثور على المحتوى."
            : "Content not found."}
        </p>
      </div>
    );
  }

  // Extract metadata and content from the prop
  const { title, author, date, content: markdownContent } = content;

  // Function to determine the correct link for the "back" button
  const getBackLink = () => {
    switch (type.toLowerCase()) {
      case "articles":
        return "/articles";
      case "books":
        return "/books";
      case "blog":
        return "/blog";
      default:
        return "/";
    }
  };

  return (
    <div className="min-h-screen py-12 lg:py-20 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to={getBackLink()}
          className="inline-flex items-center space-x-2 text-serene-blue hover:text-deep-plum transition-colors font-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{language === "ar" ? "العودة" : "Back"}</span>
        </Link>

        {/* Content Details */}
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-4xl font-bold text-deep-plum font-heading mb-2">
            {title?.[language] || title || "Untitled"}
          </h1>
          <p className="text-gray-600 mb-4 text-sm">
            <span>{date ? formatDate(date) : "Unknown date"}</span> by{" "}
            <span className="font-semibold">{author || "Unknown"}</span>
          </p>

          <hr className="my-6 border-gray-200" />

          {/* Render Markdown Content */}
          <div className="prose prose-lg max-w-none font-primary text-gray-800">
            {ReactMarkdown && rehypeRaw ? (
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {markdownContent}
              </ReactMarkdown>
            ) : (
              <div>Loading markdown content...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicContentDetail;
