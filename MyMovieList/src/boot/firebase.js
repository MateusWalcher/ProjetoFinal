// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjtdM9oBox9fKh6vZ6R1ivqSzbrMXLhuA",
  authDomain: "mymovielist-446b1.firebaseapp.com",
  projectId: "mymovielist-446b1",
  storageBucket: "mymovielist-446b1.appspot.com",
  messagingSenderId: "365532683473",
  appId: "1:365532683473:web:0b8347acedbdc1fd94b9f0",
  measurementId: "G-2237WJBWYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);
const firebaseDoc = doc;
const firebaseSet = setDoc;

export default auth;
export { db, firebaseDoc, firebaseSet, getAuth, setDoc, getDoc };


