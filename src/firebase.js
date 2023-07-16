// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "@firebase/firestore";
const firebaseConfig = {
  apiKey: 'AIzaSyBHC_TSgXfsxjfs2l9tVUOJV_iyNvbyYvg',
  authDomain: "expense-tracker-ef918.firebaseapp.com",
  projectId: "expense-tracker-ef918",
  storageBucket: "expense-tracker-ef918.appspot.com",
  messagingSenderId: "342937276843",
  appId: "1:342937276843:web:858253fdda20c3064a42ee",
  measurementId: "G-E6EX4TKH72"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app)
export default app;