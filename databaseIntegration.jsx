//The base for this code is directly provided by Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {getStorage} from "firebase/storage"
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {getAuth, signInWithEmailAndPassword} from "firebase/auth";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRUZuFSYX5eft2eMjp6PH45LBkNbrrWCI",
  authDomain: "capstone-ca0fe.firebaseapp.com",
  databaseURL: "https://capstone-ca0fe-default-rtdb.firebaseio.com",
  projectId: "capstone-ca0fe",
  storageBucket: "capstone-ca0fe.firebasestorage.app",
  messagingSenderId: "230065401291",
  appId: "1:230065401291:web:1c8c06b155824ba4cf5a4e",
  measurementId: "G-KW1YHK2ZL8"
};

// This code allows existing users to log in
// It was made with help from https://firebase.google.com/docs/auth/web/start
function logIn(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('User logged in:', user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error logging in:', errorCode, errorMessage);
    });
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage(app);