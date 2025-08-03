// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The Firebase configuration is provided by the environment.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Check if Firebase is already initialized
let app;
if (!app) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

// Initialize Firebase App and services.
const auth = getAuth(app);
const db = getFirestore(app);

// Authenticate the user. We will use anonymous auth as a fallback.
async function authenticate() {
  const initialAuthToken =
    typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;
  try {
    if (initialAuthToken) {
      await signInWithCustomToken(auth, initialAuthToken);
    } else {
      await signInAnonymously(auth);
    }
    console.log("Firebase authentication successful.");
  } catch (error) {
    console.error("Firebase authentication failed:", error);
  }
}

authenticate();

export { app, auth, db };
