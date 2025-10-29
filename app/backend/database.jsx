"use client";

import { collection, addDoc, setDoc, doc, serverTimestamp, updateDoc, getDoc, deleteDoc, getDocs, writeBatch, query } from "firebase/firestore";
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
    const uid =
      oldData?.user_ID ||
      oldData?.uid ||
      newData?.user_ID ||
      newData?.uid ||
      null;

    const oldEmail = (oldData?.email || "").trim();
    const docId = uid || oldEmail;
    if (!docId) {
      console.error("AdminEditUser: missing uid/email identifier");
      return false;
    }

    const ref = doc(database, "users", docId);
    const snap = await getDoc(ref);
    const base = snap.exists() ? snap.data() : { user_ID: uid ?? base?.user_ID };

    const updates = {};

    if (newData?.email !== undefined) updates.email = String(newData.email).trim();
    if (newData?.displayName !== undefined) updates.displayName = newData.displayName;
    if (newData?.photoURL !== undefined) updates.photoURL = newData.photoURL;
    if (newData?.phoneNumber !== undefined) updates.phoneNumber = newData.phoneNumber;

    if (newData?.role !== undefined) updates.role = newData.role;
    if (newData?.note !== undefined) updates.note = newData.note;

    if (uid && base?.user_ID !== uid) updates.user_ID = uid;

    await setDoc(ref, { ...base, ...updates }, { merge: true });

    return true;
  } catch (err) {
    console.error("AdminEditUser (Firestore-only) error:", err);
    return false;
  }
}


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

export async function addReview(uid, reviewData, location) {
    try {
        await addDoc(collection(database, "users", uid, "reviews", location, "reviewData"), reviewData)
        //alert("Reviews Added");
    } catch (error) {
        console.error("Error: ", error);
    }
};

export async function readReviewData(location) {
    
    try {
        const userData = await getDocs(query(collection(database, "users")));
        let reviews = [];
        for (const user of userData.docs) {
          const reviewData = await getDocs(query(collection(database, "users", user.id, "reviews", location.split(' ').join(''), "reviewData")));
          if (!reviewData.empty) {
            reviewData.forEach((review) => {
              reviews.push({
                ...review.data()
              });
            });
          }
        }
        reviews = reviews.filter((rev) => rev.status === "approved");
        return reviews;
    } catch (error) {
        console.error("Error: ", error);
    }

    return null;
};

export async function loadAllReviewData() {

  try {
        const userData = await getDocs(query(collection(database, "users")));
        let reviews = [];
        for (const user of userData.docs) {
          const locationData = await getDocs(query(collection(database, "users", user.id, "reviews")));
            if (!locationData.empty) {
              for (const location of locationData.docs) {
                const reviewData = await getDocs(query(collection(database, "users", user.id, "reviews", location.id.split(' ').join(''), "reviewData")));
                if (!reviewData.empty) {
                  reviewData.forEach((review) => {
                    reviews.push({
                      ...review.data()
                    });
                  });
                }
              }
            }           
        }
        reviews = reviews.filter((rev) => rev.status === "approved");
        return reviews;
    } catch (error) {
        console.error("Error: ", error);
    }

    return null;
}

export async function loadPendingReviews() {
  try {
    console.log("Loading pending reviews...");
    const userData = await getDocs(collection(database, "users"));
    console.log("Total Users Found:", userData.docs.length);

    let pendingReviews = [];

    for (const user of userData.docs) {
      console.log("User ID Being Read:", user.id, user.data());

      const reviewData = await getDocs(collection(database, "users", user.id, "reviews"));
      console.log(`Reviews found for ${user.id}:`, reviewData.docs.map(d => d.id));

      for (const location of reviewData.docs) {
        console.log("Location (Document ID):", location.id);
        const reviewCollectionRef = collection(database, "users", user.id, "reviews", location.id, "reviewData");
        const reviewSnapshots = await getDocs(reviewCollectionRef);
        console.log(`Reviews under ${location.id}:`, reviewSnapshots.docs.length);

        for (const review of reviewSnapshots.docs) {
          console.log("Review Data:", review.data());
            pendingReviews.push(review.data());
        }
      }
    }

    console.log("Pending Reviews Loaded:", pendingReviews.length);
    return pendingReviews;

  } catch (error) {
    console.error("Error:", error);
  }

  return null;
}


export async function approveReview({ rev }) {
    try {
        const reviewRef = doc(database, "users", rev.uid, "reviews", rev.location_name.split(' ').join(''), "reviewData");
        await updateDoc(reviewRef, { status: "approved" });
        alert("Review Approved");
    } catch (error) {
        console.error("Error: ", error);
    }
}

export async function denyReview({ rev }) {
    try {
        const reviewRef = doc(database, "users", rev.uid, "reviews", rev.location_name.split(' ').join(''), "reviewData");
        await deleteDoc(reviewRef);
        alert("Review Denied");
    } catch (error) {
        console.error("Error: ", error);
    }
}

export async function ReportUser(usersInfo, { rev }) {
    const reportData = {
        reportedUserID: usersInfo.reportedUserID,
        reporterUserID: usersInfo.reporterUserID,
        reason: usersInfo.reason,
        reviewData: {
            uid: rev.uid,
            title: rev.title,
            message: rev.message,
            rating: rev.rating,
            location_name: rev.location_name,
            displayName: rev.displayName,
            date: rev.date,
            image: rev.image,
            status: rev.status
        }
    };
    try {
        await addDoc(collection(database, "reports"), reportData)
        alert("Report Submitted");
    } catch (error) {
        console.error("Error: ", error);
    }
};

export async function loadReports() {
    try {
        const reportData = await getDocs(collection(database, "reports"));
       const reports = [];
       reportData.forEach((doc) => {
        const data = doc.data();
           reports.push(data);
       });
       return reports;
    } catch (error) {
        console.error("Error: ", error);
    }

    return null;
};
