// src/pages/Subscribe.jsx
import React, { useContext } from "react";
import { LanguageContext } from "@/App";
import SubscriptionForm from "@/components/SubscriptionForm.jsx";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

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
          firebaseConfig={firebaseConfig}
        />
      </div>
    </div>
  );
};

export default Subscribe;
