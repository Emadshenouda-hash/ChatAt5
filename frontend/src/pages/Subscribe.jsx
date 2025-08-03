// src/pages/Subscribe.jsx
import React, { useContext } from "react";
import { LanguageContext } from "@/App";
import SubscriptionForm from "@/components/SubscriptionForm.jsx";

// Firebase Configuration - REPLACE THESE WITH YOUR OWN VALUES
// You can get these from your Firebase project settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Application ID (used for Firestore collections)
const appId = "YOUR_APP_ID_FOR_FIRESTORE";

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
          appId={appId}
        />
      </div>
    </div>
  );
};

export default Subscribe;
