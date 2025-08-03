import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Mail, CheckCircle } from "lucide-react";

// Firebase imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

function SubscriptionForm({ language, t, firebaseConfig, appId }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // Internationalization translations
  const translations = {
    en: {
      title: "Subscribe to Our Newsletter",
      subtitle:
        "Get the latest news and updates from our community directly to your inbox.",
      email: "Email Address",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      subscribing: "Subscribing...",
      success:
        "Thank you for subscribing! You'll receive a confirmation email shortly.",
      emailInvalid: "Please enter a valid email address.",
      error: "Failed to subscribe. Please try again.",
    },
    ar: {
      title: "اشترك في نشرتنا الإخبارية",
      subtitle:
        "احصل على أحدث الأخبار والتحديثات من مجتمعنا مباشرة إلى بريدك الوارد.",
      email: "عنوان البريد الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      subscribe: "اشترك",
      subscribing: "جاري الاشتراك...",
      success: "شكراً لاشتراكك! ستتلقى رسالة تأكيد بالبريد الإلكتروني قريباً.",
      emailInvalid: "يرجى إدخال عنوان بريد إلكتروني صحيح.",
      error: "فشل الاشتراك. الرجاء المحاولة مرة أخرى.",
    },
  };

  const pageT = t?.nav?.subscribe ? translations[language] : translations.en;

  let app;
  let db;
  let auth;

  if (
    firebaseConfig &&
    Object.keys(firebaseConfig).length > 0 &&
    firebaseConfig.projectId
  ) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
  } else {
    console.error(
      "Firebase configuration is missing. The app will not be able to connect to Firestore."
    );
  }

  // Auth Effect: Sign in with the provided token or anonymously
  useEffect(() => {
    if (!auth) {
      setError(pageT.error);
      return;
    }

    const signIn = async () => {
      try {
        const initialAuthToken =
          typeof __initial_auth_token !== "undefined"
            ? __initial_auth_token
            : null;
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Firebase Auth error:", err);
      }
    };
    signIn();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [auth]);

  const validateForm = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthReady || !db) {
      setError(
        "Authentication or database is not ready. Please wait a moment."
      );
      return;
    }

    if (!validateForm()) {
      setError(pageT.emailInvalid);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const docRef = await addDoc(
        collection(db, `/artifacts/${appId}/public/data/subscriptions`),
        {
          email,
          createdAt: new Date(),
          userId: userId || auth.currentUser?.uid || crypto.randomUUID(),
        }
      );
      console.log("Document written with ID: ", docRef.id);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError(pageT.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            {language === "ar"
              ? "تم الاشتراك بنجاح"
              : "Successfully Subscribed!"}
          </h3>
          <p className="text-green-700 mb-6">{pageT.success}</p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            {language === "ar" ? "إغلاق" : "Close"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{pageT.title}</h2>
        <p className="text-lg text-gray-600">{pageT.subtitle}</p>
      </div>
      {error && (
        <div
          className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg"
          role="alert"
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="sr-only">
            {pageT.email}
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={pageT.emailPlaceholder}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting || !isAuthReady || !db}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{pageT.subscribing}</span>
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              <span>{pageT.subscribe}</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default SubscriptionForm;
