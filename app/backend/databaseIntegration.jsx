//The base for this code is directly provided by Firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage"
import { getFirestore } from "firebase/firestore";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { CreateUserAccount, UpdateLastLogin } from "./database";


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



// This code allows new users to sign up
// It was made with help from https://firebase.google.com/docs/auth/web/start
export function signUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      CreateUserAccount(user);
      //console.log('User signed up:', user);
      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error signing up:', errorCode, errorMessage);
    });
}

// This code allows existing users to log in
// It was made with help from https://firebase.google.com/docs/auth/web/start
export function logIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      UpdateLastLogin(user);
      //console.log('User logged in:', user);
      return true;
    })
    .catch((error) => {
      //alert("User does not exist or password is incorrect");
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error logging in:', errorCode, errorMessage);
      return false;
    });
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getFirestore(app);
