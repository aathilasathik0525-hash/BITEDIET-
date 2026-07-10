import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4DkLT__cf35yy2WZfEkmKoxVtuj_SOzQ",
  authDomain: "bitediet-b070d.firebaseapp.com",
  projectId: "bitediet-b070d",
  storageBucket: "bitediet-b070d.firebasestorage.app",
  messagingSenderId: "691088704202",
  appId: "1:691088704202:web:a0dfba8c0999307de9aa33",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);