import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { HeartHandshake, CheckCircle } from "lucide-react";

// Firebase imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

function PrayerRequestForm({ language, t, firebaseConfig, appId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    request: "",
    isPrivate: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  // Internationalization translations
  const translations = {
    en: {
      title: "Submit a Prayer Request",
      subtitle:
        "Share your prayer request with our community. It will be seen by our prayer team and, if you allow, by others in our community.",
      name: "Your Name",
      email: "Email Address",
      request: "Your Prayer Request",
      requestPlaceholder: "Type your request here...",
      isPrivate: "Keep my request private",
      submit: "Submit Prayer Request",
      submitting: "Submitting...",
      success: "Thank you. Your prayer request has been submitted.",
      required: "This field is required.",
      error: "Failed to submit prayer request. Please try again.",
    },
    ar: {
      title: "أرسل طلب صلاة",
      subtitle:
        "شارك طلب صلاتك مع مجتمعنا. سيراه فريق الصلاة لدينا، وإذا سمحت، فسيراه الآخرون في مجتمعنا.",
      name: "اسمك",
      email: "عنوان البريد الإلكتروني",
      request: "طلب صلاتك",
      requestPlaceholder: "اكتب طلبك هنا...",
      isPrivate: "اجعل طلبي خاصًا",
      submit: "أرسل طلب الصلاة",
      submitting: "جاري الإرسال...",
      success: "شكراً لك. تم إرسال طلب صلاتك.",
      required: "هذا الحقل مطلوب.",
      error: "فشل إرسال طلب الصلاة. الرجاء المحاولة مرة أخرى.",
    },
  };

  const pageT = t?.cards?.prayer ? translations[language] : translations.en;

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
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = pageT.required;
    if (!formData.request.trim()) newErrors.request = pageT.required;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const docRef = await addDoc(
        collection(db, `/artifacts/${appId}/public/data/prayer_requests`),
        {
          ...formData,
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-800 mb-4">
            {language === "ar" ? "تم الإرسال بنجاح" : "Successfully Submitted!"}
          </h3>
          <p className="text-green-700 mb-6">{pageT.success}</p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                name: "",
                email: "",
                request: "",
                isPrivate: false,
              });
            }}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            {language === "ar" ? "إرسال طلب آخر" : "Submit Another Request"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mb-4">
          <HeartHandshake className="h-8 w-8 text-white" />
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {pageT.name}
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={pageT.name}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="request"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {pageT.request}
          </label>
          <textarea
            id="request"
            rows={6}
            value={formData.request}
            onChange={(e) => handleInputChange("request", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
              errors.request ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={pageT.requestPlaceholder}
          />
          {errors.request && (
            <p className="mt-1 text-sm text-red-600">{errors.request}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="isPrivate"
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label
            htmlFor="isPrivate"
            className="ml-2 block text-sm text-gray-900"
          >
            {pageT.isPrivate}
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isAuthReady || !db}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{pageT.submitting}</span>
            </>
          ) : (
            <>
              <HeartHandshake className="h-4 w-4" />
              <span>{pageT.submit}</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default PrayerRequestForm;
