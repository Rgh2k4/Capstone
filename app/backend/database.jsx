import { database, auth } from "./databaseIntegration";
import { collection, addDoc, setDoc, doc, deleteDoc, getDocs, writeBatch} from "firebase/firestore";
import { updateEmail, updatePassword } from "firebase/auth";

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
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const currentEmail = data?.currentEmail || user.email;
    const newEmail = data?.newEmail?.trim();
    const newPassword = data?.newPassword?.trim();

    if (newEmail && newEmail !== user.email) {
      await updateEmail(user, newEmail);

      const oldRef = doc(database, "users", currentEmail);
      const snap = await getDoc(oldRef);
      const newRef = doc(database, "users", newEmail);

      if (snap.exists()) {
        await setDoc(newRef, { ...snap.data(), email: newEmail }, { merge: true });
        await deleteDoc(oldRef);
      } else {
        await setDoc(newRef, { user_ID: user.uid, email: newEmail }, { merge: true });
      }
    }

    if (newPassword) {
      await updatePassword(user, newPassword);
    }

    return true;
  } catch (err) {
    console.error("EditUser error:", err);
    return false;
  }
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
