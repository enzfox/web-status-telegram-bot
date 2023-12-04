import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-pSfjAS_hhkiftFJT--GpsaJVCvYWJ7o",
  authDomain: "web-status-4cccf.firebaseapp.com",
  projectId: "web-status-4cccf",
  storageBucket: "web-status-4cccf.appspot.com",
  messagingSenderId: "347615196730",
  appId: "1:347615196730:web:d7f0bc6719d98c41132703",
};

const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, auth, db };
