import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "@/App.jsx"; // Reverted to the project alias for import

// Import only the services needed from the central firebase.js
import { db } from "@/firebase.js";

const AboutUsPage = () => {
  const { language, t } = useContext(LanguageContext);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [error, setError] = useState(null);

  // Internationalization content
  const content = {
    en: {
      title: "About Us",
      subtitle: "Our Mission and Beliefs",
      intro:
        "We are a community dedicated to serving God and spreading His love.",
      section1Title: "Our History",
      section1Text: "Founded in 2020, our church...",
    },
    ar: {
      title: "عنّا",
      subtitle: "مهمتنا ومعتقداتنا",
      intro: "نحن مجتمع مخصص لخدمة الله ونشر محبته.",
      section1Title: "تاريخنا",
      section1Text: "تأسست كنيستنا في عام 2020،...",
    },
  };

  const pageT = {
    title: t?.nav?.about || content[language].title,
    subtitle: content[language].subtitle,
    intro: content[language].intro,
    section1Title: content[language].section1Title,
    section1Text: content[language].section1Text,
  };

  // This useEffect is no longer needed since Firebase is initialized globally.
  // We'll keep the state for potential future use, but the logic is gone.
  useEffect(() => {
    if (db) {
      setFirebaseReady(true);
    } else {
      setError(
        "Failed to load content. Please check your Firebase configuration."
      );
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen py-12 bg-ivory-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-red-500 font-primary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-plum mb-2 font-heading text-center">
          {pageT.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center font-primary">
          {pageT.subtitle}
        </p>

        {/* About Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-sky-teal mb-4 font-heading">
            {pageT.intro}
          </h2>
          <p className="text-gray-800 font-primary mb-6">
            {pageT.section1Text}
          </p>
          <p className="text-gray-800 font-primary mb-6">
            {pageT.section2Text}
          </p>
          <p className="text-gray-800 font-primary">{pageT.section3Text}</p>
        </div>

        {/* Example: A simple image section, replace with your own content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-sky-teal mb-4 font-heading text-center">
            {pageT.section3Title}
          </h2>
          <div className="flex justify-center">
            {/* Using a placeholder for demonstration */}
            <img
              src="https://placehold.co/600x400"
              alt="Our community"
              className="rounded-xl shadow-md w-full md:w-3/4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
