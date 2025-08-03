import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";

function DynamicContentList({ t, type, loadFunction, language }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const data = await loadFunction();
        setContent(data || []);
      } catch (err) {
        setError(err.message);
        console.error(`Failed to load ${type}:`, err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [loadFunction, type]);

  if (loading) {
    return (
      <div className="min-h-screen py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading {type}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 text-center text-red-600">
        Error loading {type}: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-deep-plum">{type}</h1>
          <p className="text-gray-600 text-lg">
            {type === "Articles"
              ? language === "ar"
                ? "مقالات مدروسة حول الإيمان والحياة"
                : "Thoughtful pieces on faith and life"
              : ""}
          </p>
        </div>

        {content.length === 0 ? (
          <p className="text-center text-gray-600">
            {language === "ar"
              ? "لا يوجد محتوى متاح حالياً"
              : "No content available at the moment."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.map((item, index) => (
              <ContentCard
                key={item.id || index}
                item={item}
                type={type}
                language={language}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContentCard({ item, type, language }) {
  const getText = (val, fallback = "") => {
    if (typeof val === "object" && val !== null) {
      return val[language] || val.en || fallback;
    }
    return typeof val === "string" ? val : fallback;
  };

  const cleanExcerpt = (text) => {
    return (text || "")
      .replace(/---[\s\S]*?---/, "") // remove frontmatter block
      .replace(/\s+/g, " ") // normalize whitespace
      .trim();
  };

  const title = getText(item.title, "Untitled");
  const excerpt = cleanExcerpt(
    getText(item.excerpt, getText(item.description, ""))
  );
  const date = item.date
    ? new Date(item.date).toLocaleDateString(
        language === "ar" ? "ar-EG" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : "—";

  const linkPath = `/${type.toLowerCase()}/${item.id}`;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
      <img
        src={item.image || "/default.jpg"}
        alt={title}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <div
          className={`flex items-center text-sm text-gray-500 mb-3 ${
            language === "ar" ? "flex-row-reverse" : ""
          }`}
        >
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {date}
          </span>
          <span className="mx-3">–</span>
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {item.author || "Unknown"}
          </span>
        </div>

        <h2
          className={`text-xl font-bold mb-2 ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {title}
        </h2>

        <p
          className={`text-gray-600 mb-4 ${
            language === "ar" ? "text-right" : "text-left"
          }`}
        >
          {excerpt || "..."}
        </p>

        <Link to={linkPath}>
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
            <span
              className={`flex items-center justify-center gap-2 ${
                language === "ar" ? "flex-row-reverse" : ""
              }`}
            >
              {language === "ar" ? "اقرأ المزيد" : "Read More"}
              <ArrowRight
                className={`w-4 h-4 transition-transform ${
                  language === "ar" ? "rotate-180" : ""
                }`}
              />
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default DynamicContentList;
