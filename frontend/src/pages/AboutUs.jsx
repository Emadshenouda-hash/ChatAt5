import React, { useContext, useEffect, useState } from "react";
import { LanguageContext } from "@/App.jsx"; // Reverted to the project alias for import

// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
getFirestore(app);

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
      section1Text:
        "Founded in 2020, our church began with a small group of believers meeting in a home. Over the years, we have grown into a vibrant community, committed to worship, fellowship, and outreach.",
      section2Title: "Our Beliefs",
      section2Text:
        "We believe in the Holy Trinity, the divinity of Jesus Christ, and the power of the Holy Spirit. Our faith is rooted in the Holy Bible, which we hold to be the inspired Word of God. We are passionate about prayer, worship, and living a life that reflects God's love to the world.",
      section3Title: "Our Team",
      section3Text:
        "Our church is led by a dedicated team of pastors and volunteers who are passionate about shepherding our flock. We are here to support you in your spiritual journey and help you grow in your relationship with Christ.",
      loading: "Loading content...",
      error:
        "Failed to load content. Please check your Firebase configuration.",
    },
    ar: {
      title: "من نحن",
      subtitle: "رسالتنا ومعتقداتنا",
      intro: "نحن مجتمع مكرس لخدمة الله ونشر محبته.",
      section1Title: "تاريخنا",
      section1Text:
        "تأسست كنيستنا في عام 2020 بمجموعة صغيرة من المؤمنين يجتمعون في منزل. على مر السنين، نمونا إلى مجتمع نابض بالحياة ملتزم بالعبادة والزمالة والخدمة.",
      section2Title: "معتقداتنا",
      section2Text:
        "نحن نؤمن بالثالوث الأقدس، وبتأليه يسوع المسيح، وبقوة الروح القدس. إيماننا متجذر في الكتاب المقدس، الذي نعتبره كلمة الله الموحى بها. نحن متحمسون للصلاة والعبادة وعيش حياة تعكس محبة الله للعالم.",
      section3Title: "فريقنا",
      section3Text:
        "يقود كنيستنا فريق مخلص من القساوسة والمتطوعين المتحمسين لرعاية قطيعنا. نحن هنا لدعمك في رحلتك الروحية ومساعدتك على النمو في علاقتك بالمسيح.",
      loading: "جاري تحميل المحتوى...",
      error: "فشل تحميل المحتوى. يرجى التحقق من إعدادات Firebase.",
    },
  };

  const pageT = content[language] || content.en;

  // Firebase Initialization and Auth
  useEffect(() => {
    async function initFirebaseAndAuth() {
      try {
        await signInAnonymously(auth);
        setFirebaseReady(true);
      } catch (err) {
        console.error("Firebase authentication error:", err);
        setError(pageT.error);
      }
    }
    initFirebaseAndAuth();
  }, [language]);

  if (error) {
    return (
      <div className="min-h-screen py-12 bg-ivory-white flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200 text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!firebaseReady) {
    return (
      <div className="min-h-screen py-12 bg-ivory-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-deep-plum border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">{pageT.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-ivory-white">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-deep-plum mb-2 font-heading text-center">
          {t?.nav?.about || pageT.title}
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
              src="https://placehold.co/800x400/deep-plum/white?text=Our+Team"
              alt="Our Team"
              className="rounded-xl shadow-md w-full max-w-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
