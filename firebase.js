import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL88PzK8f_-4ZoPkGN_LgvxjZct8fncpM",
  authDomain: "tombola-bf6d0.firebaseapp.com",
  projectId: "tombola-bf6d0",
  storageBucket: "tombola-bf6d0.appspot.com",
  messagingSenderId: "232118422582",
  appId: "1:232118422582:web:32bcb4de2fbd4c6715dc97",
  measurementId: "G-7FNEVL76LK"
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
