import { database } from "./databaseIntegration";
import { collection, addDoc, setDoc, doc, deleteDoc, getDocs, writeBatch} from "firebase/firestore";

export async function CreateUserAccount(data) {
  try {
    console.log("Adding user to Firestore with ID:", data.uid);
    
    await setDoc(doc(database, "users", data.email), {
      user_ID: data.uid,
      email: data.email,
      dateCreated: Date.now(),
      role: "User",
      note: "",
      lastLogin: "",
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

export async function LoadUserList(data) {

};

export async function SetLastLoginDate(data) {

};

export async function EditUser(data) {

};

export async function DeleteUser(data) {
  try {
    const email = data?.email;
    if (!email) return false;

    const userRef = doc(database, "users", email);

    const reviewsSnap = await getDocs(collection(userRef, "review"));
    if (!reviewsSnap.empty) {
      const batch = writeBatch(database);
      reviewsSnap.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }

    await deleteDoc(userRef);

    return true;
  } catch (error) {
    console.error("DeleteUser error:", error);
    return false;
  }
};

export async function CreateAdminAccount(data) {

};

export async function addData(userID, reviewData) {

    try {
        const refId = await addDoc(collection(database, "users", userID, "review"), reviewData);
        return refId;
    } catch (error) {
        console.error("Error: ", error);
    }
    try {
      await setDoc(doc(db, "users", data.uid), {
        user_ID: data.uid,
        email: data.email,
        password: data.password,
        dateCreated: Date.now(),
        role: "Admin",
        note: "",
        lastLogin: "",
      });

      await setDoc(doc(db, "admins", data.uid), {
      });

      return true;
  } catch (error) {
    console.log(error);
  }
};