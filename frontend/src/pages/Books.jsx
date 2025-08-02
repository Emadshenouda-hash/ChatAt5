import React, { useContext } from "react";
import { LanguageContext } from "@/App";
import { loadBooks } from "@/utils/contentLoader";

const Books = () => {
  const { language, t } = useContext(LanguageContext);
  const books = loadBooks().filter(b => b.language === language);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-deep-plum mb-8 text-center">{t.nav.books}</h1>
      {books.length === 0 ? (
        <p>{t.general.noContent}</p>
      ) : (
        <ul className="space-y-4">
          {books.map(book => (
            <li key={book.id} className="p-4 border rounded shadow-sm">
              <h2 className="text-2xl font-bold">{book.title}</h2>
              <p className="text-sm text-gray-500">{book.author}</p>
              <p className="mt-2 text-gray-700">{book.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Books;