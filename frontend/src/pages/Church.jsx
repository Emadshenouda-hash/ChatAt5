import React from "react";

function ChurchPage({ language }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-deep-plum mb-6">
          {language === "ar" ? "الكنيسة" : "Church"}
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          {language === "ar"
            ? "اكتشف الكنائس المحلية وانضم إلى مجتمعات إيمانية بالقرب منك."
            : "Discover local churches and connect with communities of faith near you."}
        </p>
        <img
          src="/church.jpg"
          alt="Church community"
          className="mt-8 rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}

export default ChurchPage;
