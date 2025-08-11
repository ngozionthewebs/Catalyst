// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSAP3AgK-ZXeZki0fGcIBLuuxD0ddIrnc",
  authDomain: "catalyst-1c449.firebaseapp.com",
  projectId: "catalyst-1c449",
  storageBucket: "catalyst-1c449.firebasestorage.app",
  messagingSenderId: "548289716844",
  appId: "1:548289716844:web:229e07ac55132d9afa6e49"
};

// Initialize Firebase and export the services
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);