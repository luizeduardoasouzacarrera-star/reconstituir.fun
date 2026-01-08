import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCHScM8UbJjH-4aw8gZwClant01Mo0xAkc",
    authDomain: "reconstituir-b35a3.firebaseapp.com",
    projectId: "reconstituir-b35a3",
    storageBucket: "reconstituir-b35a3.firebasestorage.app",
    messagingSenderId: "238396957236",
    appId: "1:238396957236:web:ce32659a6be89db1ab2061"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
