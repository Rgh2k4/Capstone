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