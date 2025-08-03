import React, { useContext } from "react";
import { LanguageContext } from "@/App";
import SubscriptionForm from "@/components/SubscriptionForm.jsx";
import { db } from "@/firebase.js"; // Import the Firestore database instance

const Subscribe = () => {
  const { language, t } = useContext(LanguageContext);

  const pageT = t?.nav?.subscribe
    ? {
        title: t.nav.subscribe,
        subtitle:
          language === "en"
            ? "Stay up to date with our community."
            : "ابق على اطلاع دائم بأخبار مجتمعنا.",
      }
    : {
        title: "Subscribe",
        subtitle:
          language === "en"
            ? "Stay up to date with our community."
            : "ابق على اطلاع دائم بأخبار مجتمعنا.",
      };

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-plum mb-2 font-heading text-center">
          {pageT.title}
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center font-primary">
          {pageT.subtitle}
        </p>
        <SubscriptionForm
          language={language}
          t={t}
          db={db} // Pass the Firestore instance to the form component
        />
      </div>
    </div>
  );
};

export default Subscribe;
