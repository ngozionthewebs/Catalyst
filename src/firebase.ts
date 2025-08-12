import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSAP3AgK-ZXeZki0fGcIBLuuxD0ddIrnc",
  authDomain: "catalyst-1c449.firebaseapp.com",
  projectId: "catalyst-1c449",
  storageBucket: "catalyst-1c449.firebasestorage.app",
  messagingSenderId: "548289716844",
  appId: "1:548289716844:web:229e07ac55132d9afa6e49"
};

// Initialise the Firebase App
const app = initializeApp(firebaseConfig);

// Initialise Auth using the standard getAuth method.
// We will let Expo's environment handle the underlying persistence.
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);