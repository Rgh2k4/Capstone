import { database } from "./databaseIntegration";
import { collection, addDoc, setDoc, doc, serverTimestamp, updateDoc, getDoc, getDocs } from "firebase/firestore";

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

export async function EditUser(data) {

};

export async function DeleteUser(data) {

};

export function isAdmin(data) {
  if (data.role === "Admin") {
    return true;
  } else {
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
