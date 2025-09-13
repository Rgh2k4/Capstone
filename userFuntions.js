import {auth} from "./databaseIntegration";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth"

// This code allows new users to sign up
// It was made with help from https://firebase.google.com/docs/auth/web/start
const auth = getAuth();
function signUp(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log('User signed up:', user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error signing up:', errorCode, errorMessage);
    });
}

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