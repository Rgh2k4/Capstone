import { collection, addDoc, setDoc, doc, serverTimestamp, updateDoc, getDoc, deleteDoc, getDocs, writeBatch } from "firebase/firestore";
import { database, auth } from "./databaseIntegration";
import { updateEmail, updatePassword } from "firebase/auth";

export async function CreateUserAccount(data) {
  try {
    console.log("Adding user to Firestore with ID:", data.uid);
    
    await setDoc(doc(database, "users", data.email), {
      user_ID: data.uid,
      email: data.email,
      dateCreated: serverTimestamp(),
      role: "User",
      note: "",
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
    await updateDoc(doc(database, "users", user.email), {
      lastLogin: serverTimestamp(),
    });
    console.log("Updated last login for", user.email);
  } catch (error) {
    console.error("Error updating last login:", error);
  }
}

export async function GetUserData(userEmail) {
  try {
    const userDoc = await getDoc(doc(database, "users", userEmail));
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

export async function SetDisplayName(user, displayName) {
  try {
    await updateDoc(doc(database, "users", user.email), {
      displayName: displayName,
    });
    console.log("Updated display name for", user.email);
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


export async function DeleteUser() {
  try {

    const user = auth.currentUser;
    user.delete()
    if (user) {
      try {
        //await user.delete()
      } catch (e) {
        console.error("Auth delete error (re-auth may be required):", e);
        alert("Hey");
 
      }
    }

    const userRef = doc(database, "users", email);

    // const reviewsSnap = await getDocs(collection(userRef, "review"));
    // if (!reviewsSnap.empty) {
    //   const batch = writeBatch(database);
    //   reviewsSnap.forEach((d) => batch.delete(d.ref));
    //   await batch.commit();
    // }

    await deleteDoc(userRef);
    return true;
  } catch (error) {
    console.error("DeleteUser error:", error);
    return false;
  }
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
