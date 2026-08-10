// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAz1Md9gASDtWTSl0CkPq3T7aChJoeW_6c",
  authDomain: "expense-tracker-4a5b4.firebaseapp.com",
  projectId: "expense-tracker-4a5b4",
  storageBucket: "expense-tracker-4a5b4.firebasestorage.app",
  messagingSenderId: "972599550531",
  appId: "1:972599550531:web:ff5bd2f1da206c33fc6af6",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
