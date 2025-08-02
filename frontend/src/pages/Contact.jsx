import React, { useContext } from "react";
import { LanguageContext } from "@/App";

const Contact = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-deep-plum mb-6 text-center">{t.nav.contact}</h1>
      <p className="text-lg text-gray-700 leading-relaxed">{t.contact.message}</p>
    </div>
  );
};

export default Contact;