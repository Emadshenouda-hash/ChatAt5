import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";

function DynamicContentList({
  t,
  type = "Articles",
  loadFunction = () => [],
  language = "en",
}) {
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
      <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
        <div className="text-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-serene-blue border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-gray-600 font-primary">
            {language === "ar" ? "جار التحميل..." : `Loading ${type}...`}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
        <div className="text-center py-20">
          <p className="text-red-600 font-primary">
            {language === "ar"
              ? "حدث خطأ أثناء التحميل:"
              : `Error loading ${type}:`}{" "}
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-deep-plum mb-4 font-hero">
            {t?.nav?.[type.toLowerCase()] || type}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-primary leading-relaxed">
            {type === "Articles" &&
              (language === "ar"
                ? "مقالات مدروسة حول الإيمان والحياة"
                : "Thoughtful pieces on faith and life")}
            {type === "Blog" &&
              (language === "ar"
                ? "قصص وتأملات من مجتمعنا"
                : "Stories and reflections from our community")}
            {type === "Books" &&
              (language === "ar"
                ? "موارد روحية لرحلة إيمانك"
                : "Spiritual resources for your faith journey")}
          </p>
        </div>

        {content.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 font-primary text-lg">
              {language === "ar"
                ? "لا يوجد محتوى متاح حالياً"
                : "No content available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.map((item, index) => (
              <ContentCard
                key={item.id || index}
                item={item}
                type={type}
                language={language}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ContentCard({ item, type, language, index }) {
  const getSafeText = (field, fallback = "") => {
    if (typeof field === "object" && field !== null) {
      return field[language] || field.en || fallback;
    }
    return typeof field === "string" ? field : fallback;
  };

  const title = getSafeText(item.title, "Untitled");
  const excerpt = getSafeText(item.excerpt, "");
  const description = getSafeText(item.description, "");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return language === "ar"
      ? date.toLocaleDateString("ar-EG")
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const linkPath = `/${type.toLowerCase()}/${item.id}`;

  return (
    <div className="group bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200">
      <div className="relative">
        <img
          src={item.image || "/default.jpg"}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {item.featured && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-primary">
            {language === "ar" ? "مميز" : "Featured"}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2 font-primary">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{item.date ? formatDate(item.date) : "—"}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{item.author || "Unknown"}</span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 font-heading line-clamp-2 mb-2">
          {title}
        </h2>

        <p className="text-sm text-gray-600 font-primary mb-4 line-clamp-3">
          {excerpt || description}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-4 font-primary">
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            {item.category || item.genre || "—"}
          </span>
          {item.tags?.length > 0 && (
            <span>
              <Tag className="inline-block h-4 w-4 mr-1 text-gray-400" />
              {item.tags.slice(0, 2).join(", ")}
            </span>
          )}
        </div>

        <Link to={linkPath}>
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition font-primary flex items-center justify-center gap-2">
            {language === "ar" ? "اقرأ المزيد" : "Read More"}
            <ArrowRight
              className={`h-4 w-4 ${
                language === "ar" ? "transform rotate-180" : ""
              }`}
            />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default DynamicContentList;
