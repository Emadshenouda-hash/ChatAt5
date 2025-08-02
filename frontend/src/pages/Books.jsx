import React, { useEffect, useState, useContext } from "react";
import { LanguageContext } from "@/App";
import { loadBooks } from "@/lib/contentLoader";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Books() {
  const { language, t } = useContext(LanguageContext);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await loadBooks();
        setBooks(data || []);
      } catch (err) {
        console.error("Error loading books:", err);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredBooks = books.filter((book) => book.language === language);

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-plum mb-8 font-heading">
          {t.nav.books}
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : filteredBooks.length === 0 ? (
          <p>No books available.</p>
        ) : (
          <ul className="space-y-6">
            {filteredBooks.map((book) => (
              <li
                key={book.slug}
                className="border border-gray-200 p-4 rounded shadow-md"
              >
                <h2 className="text-2xl font-semibold text-sky-teal font-heading">
                  {book.title?.[language] || book.title}
                </h2>
                <p className="text-gray-600 mb-2 text-sm">
                  {book.date} - {book.author}
                </p>
                <p className="text-gray-800 font-primary mb-2">
                  {book.description?.[language] || ""}
                </p>
                <p className="text-gray-700 text-sm font-primary italic mb-4">
                  {language === "en" ? "Audience:" : "الجمهور"} {book.audience}
                </p>
                <Link to={`/books/${book.slug}`}>
                  <Button className="bg-serene-blue text-white hover:bg-deep-plum font-primary">
                    {language === "en" ? "Read Summary" : "اقرأ الملخص"}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Books;
