import React from "react";
import { Calendar, User, ArrowRight } from "lucide-react";

function ContentList({ items, language, type = "article" }) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {language === "ar"
            ? "لا توجد عناصر متاحة حالياً"
            : "No items available at the moment"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => {
        const title =
          typeof item.title === "object"
            ? item.title?.[language] || item.title?.en || "Untitled"
            : item.title || "Untitled";

        const excerpt =
          typeof item.excerpt === "object"
            ? item.excerpt?.[language] || item.excerpt?.en || ""
            : item.excerpt || "";

        const description =
          typeof item.description === "object"
            ? item.description?.[language] || item.description?.en || ""
            : item.description || "";

        return (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Image */}
            {item.image && (
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/600x400/e5e7eb/6b7280?text=${encodeURIComponent(
                      title
                    )}`;
                  }}
                />
              </div>
            )}

            <div className="p-6">
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                {item.category && (
                  <span className="bg-gray-100 px-2 py-1 rounded-full">
                    {item.category}
                  </span>
                )}
                {item.date && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(item.date).toLocaleDateString(
                        language === "ar" ? "ar-SA" : "en-US"
                      )}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {title}
              </h3>

              <p className="text-gray-700 mb-4 line-clamp-3">
                {excerpt || description}
              </p>

              {item.author && (
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span>{item.author}</span>
                </div>
              )}

              {/* 🔥 FIXED Button: Tailwind only */}
              <button
                className="flex w-full items-center justify-center gap-2 border border-serene-blue text-serene-blue hover:bg-serene-blue hover:text-white py-2 px-4 rounded-md transition-all"
                onClick={() => {
                  window.location.href = `/${type}s/${item.id}`;
                }}
              >
                <span>
                  {type === "book"
                    ? language === "ar"
                      ? "عرض التفاصيل"
                      : "View Details"
                    : language === "ar"
                    ? "اقرأ المزيد"
                    : "Read More"}
                </span>
                <ArrowRight
                  className={`h-4 w-4 transition-transform ${
                    language === "ar" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContentList;
