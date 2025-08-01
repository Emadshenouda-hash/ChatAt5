import React from "react";

function SurrenderPage({ language }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-ivory-white to-white py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold text-deep-plum mb-6">
          {language === "ar" ? "الاستسلام" : "Surrender"}
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          {language === "ar"
            ? "موارد تساعدك في تسليم حياتك لله ونموك الروحي."
            : "Resources to help you surrender your life to God and grow spiritually."}
        </p>
        <img
          src="/surrender.jpg"
          alt="Surrender to faith"
          className="mt-8 rounded-xl shadow-lg"
        />
      </div>
    </div>
  );
}

export default SurrenderPage;
