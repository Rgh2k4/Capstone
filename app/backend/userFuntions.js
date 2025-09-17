import {auth} from "./app/backend/databaseIntegration";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth"
import {getStorage, ref, uploadBytes} from "firebase/storage"

// This code allows new users to sign up
// It was made with help from https://firebase.google.com/docs/auth/web/start
const auth = getAuth();
export function signUp(email, password) {
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
export function logIn(email, password) {
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

//This code allows users to upload images to the database
//This was written by Robert in a previous class with help from VS code snippets, broken down to match other functions
function uploadFile(file, location) {
  const auth = getAuth();
  const storage = getStorage();
  const user = auth.currentUser;

  if (!file) {
    console.error("Please select a file.");
    return;
  }
  if (!user) {
    console.error("You must be logged in.");
    return;
  }

  const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);

  uploadBytes(storageRef, file, { customMetadata: { location } })
    .then(() => {
      console.log("Upload successful!");
    })
    .catch((error) => {
      console.error("Upload failed:", error.code, error.message);
    });
}