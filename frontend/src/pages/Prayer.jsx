import React, { useContext } from "react";
import { LanguageContext } from "@/App";

const Prayer = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-deep-plum mb-6 text-center">{t.nav.prayer}</h1>
      <p className="text-lg text-gray-700 leading-relaxed">{t.prayer.intro}</p>
    </div>
  );
};

export default Prayer;