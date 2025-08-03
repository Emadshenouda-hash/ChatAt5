// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithCustomToken,
  signInAnonymously,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The Firebase configuration is provided by the environment.
const firebaseConfig = JSON.parse(
  typeof __firebase_config !== "undefined" ? __firebase_config : "{}"
);
const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
const initialAuthToken =
  typeof __initial_auth_token !== "undefined" ? __initial_auth_token : null;

// Initialize Firebase App and services.
let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  // Authenticate the user using the custom token if available, otherwise sign in anonymously.
  async function authenticate() {
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
} catch (error) {
  console.error("Firebase initialization failed:", error);
}

export { app, auth, db, appId };
