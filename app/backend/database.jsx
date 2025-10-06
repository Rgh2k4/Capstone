import { database } from "./databaseIntegration";
import { collection, addDoc } from "firebase/firestore";

export async function addData(userID, data) {
  try {
    const refId = await addDoc(
      collection(database, "users", userID, "reviewData"),
      data
    );
    return refId;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function CreateUserAccount(data) {
  try {
    const refId = await addDoc(collection(database, "users"), data);
    return refId;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export const CreateUserAccount = async (data) => {
  try {
    await setDoc(doc(db, "users", data.uid), {
      user_ID: data.uid,
      email: data.email,
      password: data.password,
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

export const CreateAdminAccount = async (data) => {
  try {
    const userImportRecords = {
        user_ID: data.uid,
        email: data.email,
        password: data.password,
        dateCreated: Date.now(),
    }
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
