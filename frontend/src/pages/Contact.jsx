// src/pages/Contact.jsx
import React, { useContext } from "react";
import { LanguageContext } from "@/App";
import ContactForm from "@/components/ContactForm.jsx";

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

const Contact = () => {
  const { language, t } = useContext(LanguageContext);

  const pageT = t?.nav?.contact
    ? {
        title: t.nav.contact,
        subtitle:
          language === "en"
            ? "We're here to help. Reach out with any questions or comments."
            : "نحن هنا للمساعدة. تواصل معنا لأي أسئلة أو تعليقات.",
      }
    : {
        title: "Contact Us",
        subtitle:
          language === "en"
            ? "We're here to help. Reach out with any questions or comments."
            : "نحن هنا للمساعدة. تواصل معنا لأي أسئلة أو تعليقات.",
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
        <ContactForm
          language={language}
          t={t}
          firebaseConfig={firebaseConfig}
          appId={appId}
        />
      </div>
    </div>
  );
};

export default Contact;
