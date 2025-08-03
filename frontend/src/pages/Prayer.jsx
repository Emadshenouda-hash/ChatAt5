import React, { useContext } from "react";
import { LanguageContext } from "@/App";
import PrayerRequestForm from "@/components/PrayerRequestForm.jsx";
import { db } from "@/firebase.js"; // Import the Firestore database instance

const Prayer = () => {
  const { language, t } = useContext(LanguageContext);
  const pageT = t?.cards?.prayer || {};

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-plum mb-2 font-heading text-center">
          {pageT.title || "Prayer Requests"}
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center font-primary">
          {pageT.description || "Share your prayer needs with our community."}
        </p>
        <PrayerRequestForm
          language={language}
          t={t}
          db={db} // Pass the Firestore instance to the form component
        />
      </div>
    </div>
  );
};

export default Prayer;
