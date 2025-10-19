"use client";

import { collection, addDoc, setDoc, doc, serverTimestamp, updateDoc, getDoc, deleteDoc, getDocs, writeBatch } from "firebase/firestore";
import { database, auth } from "./databaseIntegration";
import { EmailAuthProvider, fetchSignInMethodsForEmail, reauthenticateWithCredential, signInWithCredential, updateEmail, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";

export async function CreateUserAccount(data) {
  try {
    //console.log("Adding user to Firestore with ID:", data.uid);
    
    await setDoc(doc(database, "users", data.uid), {
      user_ID: data.uid,
      email: data.email,
      dateCreated: serverTimestamp(),
      role: "User",
      note: "",
      displayName: data.displayName || "",
      lastLogin: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.log(error);
  }
};

export async function LoadUserList() {
  try {
    const querySnapshot = await getDocs(collection(database, "users"));
    const users = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.role === "User") {
        users.push(data);
      }
    });

    return users;
  } catch (error) {
    console.error("Error getting user list:", error);
    return [];
  }

};

export async function LoadAdminList() {
  try {
    const querySnapshot = await getDocs(collection(database, "users"));
    const admins = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.role === "Admin") {
        admins.push(data);
      }
    });

    return admins;
  } catch (error) {
    console.error("Error getting admin list:", error);
    return [];
  }

};

export async function UpdateLastLogin(user) {
  try {
    await updateDoc(doc(database, "users", user.uid), {
      lastLogin: serverTimestamp(),
    });
    console.log("Updated last login for", user.email);
  } catch (error) {
    console.error("Error updating last login:", error);
  }
}

export async function GetUserData(uid) {
  try {
    const userDoc = await getDoc(doc(database, "users", uid));
    if (userDoc.exists()) {     
      return userDoc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export async function SetDisplayName( displayName) {
  const user = auth.currentUser;
  try {
    await updateDoc(doc(database, "users", user.uid), {
      displayName: displayName,
    });
    console.log("Updated display name for", user.uid);
  } catch (error) {
    console.error("Error updating display name:", error);
  }
}

export function isAdmin(data) {
  if (data.role === "Admin") {
    return true;
  } else {
    return false;
  }
}


export async function AdminEditUser({ oldData, newData }) {
  try {
    const oldEmail = oldData?.email?.trim();
    const newEmail = newData?.email?.trim();
    if (!oldEmail || !newEmail) return false;

    const oldRef = doc(database, "users", oldEmail);
    const snap = await getDoc(oldRef);
    const base = snap.exists() ? snap.data() : {};
    const role = newData.role ?? base.role ?? "User";
    const note = newData.note ?? base.note ?? "";

    if (newEmail !== oldEmail) {
      const newRef = doc(database, "users", newEmail);
      const moved = {
        ...base, 
        email: newEmail,
        role,
        note,
      };
      await setDoc(newRef, moved);
      await deleteDoc(oldRef);
    } else {
      await updateDoc(oldRef, { role, note });
    }

    return true;
  } catch {
    return false;
  }
};

export async function EditUser(type, value) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");
    const currentPassword = value?.currentPassword?.trim();
    console.log("Current Password:", currentPassword);
    const currentEmail = user.email;


    
    if (type === "email"){
      const newEmail = value?.newValue?.trim();
      console.log("New Email:", newEmail);
      
      const methods = await fetchSignInMethodsForEmail(auth, newEmail);
      if (methods.length > 0) {
        throw new Error("Email already in use");
      }
      
      const ref = doc(database, "users", user.uid);
      await updateDoc(ref, { email: newEmail });
      await updateEmail(user, newEmail);
      return true;


    } else if (type === "password") {
      const newPassword = value?.newValue?.trim();

      if (newPassword) {
        await updatePassword(user, newPassword);
    }
      return true;
  } else {
      return false;
    }

  } catch (err) {
    console.error("EditUser error:", err);
    return err.message || false;
  }
};


export async function DeleteUser() {
  try {
    const user = auth.currentUser; 
    await deleteDoc(doc(database, "users", user.uid))
    await user.delete()   
    return true;
  } catch (e) {
        console.error("Auth delete error (re-auth may be required):", e);
        return false;
      }
  }

export async function addReview(uid, reviewData) {
    try {
        const refId = await addDoc(collection(database, "users", uid, "reviews"), reviewData);
        return refId;
    } catch (error) {
        console.error("Error: ", error);
    }
};

export async function readData(userID) {
    const review = [];

    try {
        const reviewData = await getDocs(query(collection(database, "users", userID, "review")));
        reviewData.forEach((review) => {
            review.push({
                ...review.data()
            });
        });
    } catch (error) {
        console.error("Error: ", error);
    }

    return review;
};
