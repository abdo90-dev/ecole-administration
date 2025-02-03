import { getApps, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBHgPA5QtTGrI0JzGu084C5adHBzD1_4ko",
  authDomain: "ecole-preve.firebaseapp.com",
  projectId: "ecole-preve",
  databaseURL: "https://ecole-preve-default-rtdb.europe-west1.firebasedatabase.app", // Updated URL

  storageBucket: "ecole-preve.firebasestorage.app",
  messagingSenderId: "716461888701",
  appId: "1:716461888701:web:43032b48b11d534fa913d4",
  measurementId: "G-RL762JMRKN"
};

// Initialize Firebase only if no apps are initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };