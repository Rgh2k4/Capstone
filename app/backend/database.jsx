"use client";

import { collection, addDoc, setDoc, doc, serverTimestamp, updateDoc, getDoc, deleteDoc, getDocs, writeBatch, query, where } from "firebase/firestore";
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
      await updateDoc(doc(database, "users", oldData.user_ID), {
        displayName: newData.displayName,
        email: newData.email,
        note: newData.note
      });
      console.log();
      return true;
  } catch (err) {
    console.error("AdminEditUser (Firestore-only) error:", err);
    return false;
  }
}


export async function AdminDeleteUser({ uid }) {
    try {
      await deleteDoc(doc(database, "users", uid))
      console.log();
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

export async function addReview(reviewData) {
    try {
        const docRef = await addDoc(collection(database, "reviews"), {
          reviewData,
          dateSubmitted: serverTimestamp(),
          status: "pending",
          reviewID: "",
          location_name: reviewData.location_name
        }).then(async (docRef) => {
          await updateDoc(doc(database, "reviews", docRef.id), {
            reviewID: docRef.id
          });
        });

        //alert("Reviews Added");
    } catch (error) {
        console.error("Error: ", error);
    }
};

export async function readReviewData(location) {
    
    try {
        let reviews = []
        const reviewData = await getDocs(query(collection(database, "reviews"), where("location_name", "==", location)));
        console.log("Total Reviews Fetched:", reviewData.size);
        if (!reviewData.empty) {
          reviewData.forEach((review) => {
            if (review.data().status === "approved") {
              const userData = GetUserData(review.data().reviewData.uid);
              console.log("userData:", userData);
              console.log("User:", userData.displayName);
              const name = userData.displayName;
              if (userData.displayName === "") {
                reviews.push({
                  ...review.data(), displayName: "Anonymous"
                });
              } else {
                reviews.push({
                  ...review.data(), displayName: name
                });
              }
            }
          });
        }
        console.log("=== Approved Reviews ===");
        
        console.log("Approved Reviews Loaded:", reviews);
        reviews = reviews.filter((rev) => rev.status === "approved");
        return reviews;
    } catch (error) {
        console.error("Error: ", error);
    }

    return null;
};

export async function loadPendingReviews() {
  try {
    console.log("Loading pending reviews...");
    const pendingReviews = [];
    const reviewData = await getDocs(query(collection(database, "reviews")));
    //console.log("Total Reviews Fetched:", reviewData.size);
    for (const review of reviewData.docs) {
      if (review.data().status === "pending") {
        pendingReviews.push({
          ...review.data()
        });
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
  //console.log("Approving review:", rev.reviewID);
    try {
        const reviewRef = doc(database, "reviews", rev.reviewID);
        await updateDoc(reviewRef, { status: "approved" });
        alert("Review Approved");
    } catch (error) {
        console.error("Error: ", error);
    }
}

export async function denyReview({ rev }) {
    try {
        const reviewRef = doc(database, "reviews", rev.reviewID);
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
        dateReported: serverTimestamp(),
        status: "unresolved",
        reviewData: {
            uid: rev.uid,
            title: rev.title,
            message: rev.message,
            rating: rev.rating,
            location_name: rev.location_name,
            displayName: rev.displayName,
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

export async function resolveReport(report, actions) {
  try {
    console.log("Resolving report for:", report);
      const reportOriginalRef = query(collection(database, "reports"), where("reportedUserID", "==", report.reportedUserID), where("reporterUserID", "==", report.reporterUserID), where("dateReported", "==", report.dateReported));
      await updateDoc(reportOriginalRef, { status: "resolved" });
      const reportCopyRef = getDocs(database, "reports");
      for (const review of reportCopyRef) {
          if (review.data().reviewData === report.reviewData && review.data().status === "unresolved") {
              await deleteDoc(review);
          }
      }
      if (action === "delete") {
          const reviewRef = query(collection(database, "reviews"), where("uid", "==", report.reviewData.uid), where("title", "==", report.reviewData.title), where("message", "==", report.reviewData.message), where("location_name", "==", report.reviewData.location_name));
          await deleteDoc(reviewRef);
      }
      alert("Report Resolved");
  } catch (error) {
      console.error("Error: ", error);
  }
};

export async function pullProfileImageURL(user) {
  try {
    const docSnapshot = await getDoc(doc(database, 'users', user.uid))
    const data = docSnapshot.data();
    return data.profileImage;
  } catch (error) {
    console.error("Error: ", error);
  }
}
