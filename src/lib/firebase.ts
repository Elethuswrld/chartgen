
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyALjO0nF9iElTr_ZWrCEKqhE2QfAsTT6Dw",
  authDomain: "chartgen-web.firebaseapp.com",
  projectId: "chartgen-web",
  storageBucket: "chartgen-web.appspot.com",
  messagingSenderId: "45869815252",
  appId: "1:45869815252:web:9e0100304bb240e2c63241",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
