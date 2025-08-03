import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Send, CheckCircle, MessageCircle } from "lucide-react";

// Firebase imports
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

function ContactForm({ language, t, firebaseConfig, appId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
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
      title: "Get in Touch",
      subtitle:
        "Fill out the form below and we'll get back to you as soon as possible.",
      name: "Your Name",
      email: "Email Address",
      message: "Message",
      messagePlaceholder: "Type your message here...",
      submit: "Send Message",
      submitting: "Sending...",
      success: "Thank you for contacting us! We will get back to you shortly.",
      required: "This field is required.",
      emailInvalid: "Please enter a valid email address.",
      error: "Failed to send message. Please try again.",
    },
    ar: {
      title: "تواصل معنا",
      subtitle: "املأ النموذج أدناه وسنتواصل معك في أقرب وقت ممكن.",
      name: "اسمك",
      email: "عنوان البريد الإلكتروني",
      message: "رسالة",
      messagePlaceholder: "اكتب رسالتك هنا...",
      submit: "إرسال الرسالة",
      submitting: "جاري الإرسال...",
      success: "شكراً لتواصلك معنا! سنتواصل معك قريباً.",
      required: "هذا الحقل مطلوب.",
      emailInvalid: "يرجى إدخال عنوان بريد إلكتروني صحيح.",
      error: "فشل إرسال الرسالة. الرجاء المحاولة مرة أخرى.",
    },
  };

  const pageT = t?.nav?.contact ? translations[language] : translations.en;

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
    if (!formData.email.trim()) {
      newErrors.email = pageT.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = pageT.emailInvalid;
    }
    if (!formData.message.trim()) newErrors.message = pageT.required;
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
        collection(db, `/artifacts/${appId}/public/data/contact_requests`),
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
            {language === "ar" ? "تم الإرسال بنجاح" : "Successfully Sent!"}
          </h3>
          <p className="text-green-700 mb-6">{pageT.success}</p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: "", email: "", message: "" });
            }}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            {language === "ar" ? "إرسال رسالة أخرى" : "Send Another Message"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-4">
          <MessageCircle className="h-8 w-8 text-white" />
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
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
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {pageT.email}
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={pageT.email}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {pageT.message}
          </label>
          <textarea
            id="message"
            rows={6}
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={pageT.messagePlaceholder}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isAuthReady || !db}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{pageT.submitting}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{pageT.submit}</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}

export default ContactForm;
