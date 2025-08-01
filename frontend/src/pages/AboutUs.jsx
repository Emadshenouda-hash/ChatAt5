import React from "react";

function AboutUsPage({ language }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-deep-plum mb-6">
          {language === "ar" ? "من نحن" : "About Us"}
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          {language === "ar"
            ? "نحن مجتمع مسيحي مفتوح يرحب بالجميع، خاصة في الشتات."
            : "We are an open Christian community welcoming everyone—especially those in diaspora."}
        </p>
        <img
          src="/about-us.jpg"
          alt="About ChatAT"
          className="mt-8 rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}

export default AboutUsPage;
