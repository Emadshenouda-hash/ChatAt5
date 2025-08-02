import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

function DynamicContentDetail({ t, type, getFunction, language }) {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetched = getFunction(id);
    setItem(fetched);
    setLoading(false);
  }, [id, getFunction]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {language === "ar" ? "المحتوى غير موجود" : "Content not found"}
      </div>
    );
  }

  const title =
    typeof item.title === "object"
      ? item.title[language] || item.title.en
      : item.title;
  const content = item.content?.replace(/---[\s\S]*?---/, "").trim();
  const dateFormatted = new Date(item.date).toLocaleDateString(
    language === "ar" ? "ar-EG" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 font-heading text-deep-plum">
          {title}
        </h1>

        <div className="flex items-center text-sm text-gray-500 mb-6 space-x-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {dateFormatted}
          </span>
          {item.author && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {item.author}
            </span>
          )}
        </div>

        <article className="prose prose-slate max-w-none font-primary">
          {content?.split("\n").map((line, i) => (
            <p key={i}>{line.trim()}</p>
          ))}
        </article>
      </div>
    </div>
  );
}

export default DynamicContentDetail;
