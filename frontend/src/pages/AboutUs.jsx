import React, { useContext } from "react";
import { LanguageContext } from "@/App";

const AboutUs = () => {
  const { t } = useContext(LanguageContext);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-deep-plum mb-8">{t.nav.about}</h1>
      <p className="text-lg leading-relaxed text-gray-700">
        {t.about.description}
      </p>
    </div>
  );
};

export default AboutUs;