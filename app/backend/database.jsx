"use client";

import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  query,
  where,
} from "firebase/firestore";
import { database, auth } from "./databaseIntegration";
import { EmailAuthProvider, fetchSignInMethodsForEmail, reauthenticateWithCredential, signInWithCredential, updateEmail, updatePassword, verifyBeforeUpdateEmail } from "firebase/auth";
import { ToastIcon } from "react-hot-toast";

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
      profileImage: "",
      review_count: 0,
    });
    return true;
  } catch (error) {
    console.log(error);
  }
}

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
}

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
}

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
}

export async function SetDisplayName(displayName) {
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

export async function PromoteToAdmin(uid) {
  try {
    console.log("database from add_window: Promoting user to Admin:", uid);
    await updateDoc(doc(database, "users", uid), {
      role: "Admin",
    });
    console.log("Promoted user to Admin:", uid);
    return true;
  } catch (err) {
    console.error("PromoteToAdmin error:", err);
    return false;
  }
}

// Assisted with Claude
export async function AdminDeleteUser(uid) {
  try {
    // Create a batch for atomic updates
    const batch = writeBatch(database);
    
    // Update all reviews by this user
    const reviewsQuery = query(
      collection(database, "reviews"),
      where("reviewData.uid", "==", uid)
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);
    
    reviewsSnapshot.forEach((reviewDoc) => {
      const reviewRef = doc(database, "reviews", reviewDoc.id);
      batch.update(reviewRef, {
        "reviewData.uid": "deleted-user",
        "reviewData.displayName": "Deleted User",
        "reviewData.message": "This message has been deleted",
        "reviewData.profilePic": null
      });
    });
    
    // Update all reports where this user was the reporter
    const reporterQuery = query(
      collection(database, "reports"),
      where("reporterUserID", "==", uid)
    );
    const reporterSnapshot = await getDocs(reporterQuery);
    
    reporterSnapshot.forEach((reportDoc) => {
      const reportRef = doc(database, "reports", reportDoc.id);
      batch.update(reportRef, {
        reporterUserID: "deleted-user"
      });
    });
    
    // Update all reports where this user was reported
    const reportedQuery = query(
      collection(database, "reports"),
      where("reportedUserID", "==", uid)
    );
    const reportedSnapshot = await getDocs(reportedQuery);
    
    reportedSnapshot.forEach((reportDoc) => {
      const reportRef = doc(database, "reports", reportDoc.id);
      batch.update(reportRef, {
        reportedUserID: "deleted-user",
        "reviewData.uid": "deleted-user",
        "reviewData.displayName": "Deleted User",
        "reviewData.message": "This message has been deleted",
        "reviewData.profilePic": null
      });
    });
    
    // Execute all updates atomically
    await batch.commit();
    
    // Delete the user document from Firestore
    await deleteDoc(doc(database, "users", uid));
    
    // Note: Firebase Auth user deletion from admin requires Firebase Admin SDK
    // This would typically be done on the server side with admin privileges
    // For now, we'll handle the Firestore cleanup
    console.log("User data anonymized and Firestore document deleted for:", uid);
    
    return true;
  } catch (err) {
    console.error("AdminDeleteUser error:", err);
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

    if (type === "email") {
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
}

// Assisted with Claude
export async function DeleteUser() {
  try {
    const user = auth.currentUser;
    const uid = user.uid;
    
    // Create a batch for atomic updates
    const batch = writeBatch(database);
    
    // Update all reviews by this user
    const reviewsQuery = query(
      collection(database, "reviews"),
      where("reviewData.uid", "==", uid)
    );
    const reviewsSnapshot = await getDocs(reviewsQuery);
    
    reviewsSnapshot.forEach((reviewDoc) => {
      const reviewRef = doc(database, "reviews", reviewDoc.id);
      batch.update(reviewRef, {
        "reviewData.uid": "deleted-user",
        "reviewData.displayName": "Deleted User",
        "reviewData.message": "This message has been deleted",
        "reviewData.profilePic": null
      });
    });
    
    // Update all reports where this user was the reporter
    const reporterQuery = query(
      collection(database, "reports"),
      where("reporterUserID", "==", uid)
    );
    const reporterSnapshot = await getDocs(reporterQuery);
    
    reporterSnapshot.forEach((reportDoc) => {
      const reportRef = doc(database, "reports", reportDoc.id);
      batch.update(reportRef, {
        reporterUserID: "deleted-user"
      });
    });
    
    // Update all reports where this user was reported
    const reportedQuery = query(
      collection(database, "reports"),
      where("reportedUserID", "==", uid)
    );
    const reportedSnapshot = await getDocs(reportedQuery);
    
    reportedSnapshot.forEach((reportDoc) => {
      const reportRef = doc(database, "reports", reportDoc.id);
      batch.update(reportRef, {
        reportedUserID: "deleted-user",
        "reviewData.uid": "deleted-user",
        "reviewData.displayName": "Deleted User",
        "reviewData.message": "This message has been deleted",
        "reviewData.profilePic": null
      });
    });
    
    // Execute all updates atomically
    await batch.commit();
    
    // Delete the user document from Firestore
    await deleteDoc(doc(database, "users", uid));
    
    // Delete the Firebase Auth user
    await user.delete();
    
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
      location_name: reviewData.location_name,
    }).then(async (docRef) => {
      await updateDoc(doc(database, "reviews", docRef.id), {
        reviewID: docRef.id,
      });
    });

    //alert("Reviews Added");
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function readReviewData(location) {
  try {
    let reviews = [];
    const reviewData = await getDocs(
      query(
        collection(database, "reviews"),
        where("location_name", "==", location)
      )
    );
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
              ...review.data(),
              displayName: "Anonymous",
            });
          } else {
            reviews.push({
              ...review.data(),
              displayName: name,
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
          ...review.data(),
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
  // Increment user's review count
    await incrementUserReviewCount(rev.reviewData.uid);
}

export async function denyReview({ rev }) {
  try {
    const reviewRef = doc(database, "reviews", rev.reviewID);
    await deleteDoc(reviewRef);
    toast.error("Review Denied");
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
      uid: rev.uid || "",
      title: rev.title || "",
      message: rev.message || "",
      rating: rev.rating || 0,
      location_name: rev.location_name || "",
      displayName: rev.displayName || "Anonymous",
      image: rev.image || "",
      status: rev.status || "approved" // Provide default value
    },
  };
  try {
    await addDoc(collection(database, "reports"), reportData);
    //alert("Report Submitted");
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function loadReports() {
  try {
    const reportData = await getDocs(collection(database, "reports"));
    const reports = [];
    reportData.forEach((doc) => {
      if (doc.data().status === "unresolved") {
        const data = doc.data();
        reports.push(data);
      }
    });
    return reports;
  } catch (error) {
    console.error("Error: ", error);
  }

  return null;
};

// Assisted with Claude
export async function resolveReport(report, actions) {
  try {
    console.log("Resolving report for:", report);

    const reportQuery = query(
      collection(database, "reports"),
      where("reportedUserID", "==", report.reportedUserID),
      where("reporterUserID", "==", report.reporterUserID),
      where("dateReported", "==", report.dateReported)
    );
    const reportDocs = await getDocs(reportQuery);

    for (const reportDoc of reportDocs.docs) {
      await updateDoc(doc(database, "reports", reportDoc.id), { status: "resolved" });
    }

    const allReportsSnapshot = await getDocs(collection(database, "reports"));
    for (const reportDoc of allReportsSnapshot.docs) {
      const reportData = reportDoc.data();
      if (JSON.stringify(reportData.reviewData) === JSON.stringify(report.reviewData) && 
          reportData.status === "unresolved") {
        await deleteDoc(doc(database, "reports", reportDoc.id));
      }
    }

    if (actions === "delete") {
      const reviewQuery = query(
        collection(database, "reviews"), 
        where("reviewData.uid", "==", report.reviewData.uid), 
        where("reviewData.title", "==", report.reviewData.title), 
        where("reviewData.message", "==", report.reviewData.message), 
        where("location_name", "==", report.reviewData.location_name)
      );
      const reviewDocs = await getDocs(reviewQuery);
      
      // Delete each matching review document
      for (const reviewDoc of reviewDocs.docs) {
        await deleteDoc(doc(database, "reviews", reviewDoc.id));
        alert("Report Resolved");
      }
    }
    
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

export async function updateProfileImageURL(user, file) {
  try {
    const docRef = doc(database, 'users', user.uid);
    await updateDoc(docRef, {profileImage: file.name});
  } catch (error) {
    console.error("Error: ", error);
  }
}

// Function to increment user's review count
export async function incrementUserReviewCount(uid) {
  try {
    const userRef = doc(database, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const currentCount = userData.review_count || 0; // Fallback for existing accounts
      
      await updateDoc(userRef, {
        review_count: currentCount + 1,
      });
      
      console.log(`Review count incremented for user ${uid}: ${currentCount + 1}`);
    } else {
      console.error("User not found:", uid);
    }
  } catch (error) {
    console.error("Error incrementing review count:", error);
  }
}

// Function to get user's review count with fallback initialization
export async function getUserReviewCount(uid) {
  try {
    const userRef = doc(database, "users", uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      // If review_count doesn't exist, initialize it and return 0
      if (userData.review_count === undefined) {
        await updateDoc(userRef, {
          review_count: 0,
        });
        return 0;
      }
      
      return userData.review_count;
    } else {
      console.error("User not found:", uid);
      return 0;
    }
  } catch (error) {
    console.error("Error getting review count:", error);
    return 0;
  }
}

// Function to quickly get the current user's review count
export async function getCurrentUserReviewCount() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("No authenticated user");
      return 0;
    }
    
    return await getUserReviewCount(user.uid);
  } catch (error) {
    console.error("Error getting current user review count:", error);
    return 0;
  }
}

export async function incrementReviewLikes(userID, { rev }) {
  //console.log("[database.jsx]Incrementing like for review:", rev.reviewID);
  const reviewRef = doc(database, "reviews", rev.reviewID);
  if (!(await getDoc(reviewRef)).data().likes) {
    //console.log("[database.jsx]Likes field missing, initializing to 0 for review:", rev.reviewID);
    await updateDoc(reviewRef, {
      likes: 0,
    });
    //console.log("[database.jsx]Initialized likes to 0 for review:", rev.reviewID);
  }
  
  try {
    //console.log("[database.jsx] Update likes for review:", rev.reviewID);
    let likes = (await getDoc(reviewRef)).data().likes || 0;
    await updateDoc(reviewRef, {
      likes: likes + 1,
    }).then(async () => {
      //console.log("[database.jsx]Incremented likes for review:", rev.reviewID);
      const userRef = doc(database, "users", userID, "likes", rev.reviewID);
      await setDoc(userRef, {
        reviewID: rev.reviewID,
      }); 
    });
    console.log("[database.jsx]Set liked review for user:", userID, "review:", rev.reviewID);
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function decrementReviewLikes(userID, { rev }) {
  //console.log("[database.jsx]Decrementing like for review:", rev.reviewID);
  const reviewRef = doc(database, "reviews", rev.reviewID);
  try {
    //console.log("[database.jsx] Update likes for review:", rev.reviewID);
    let likes = (await getDoc(reviewRef)).data().likes || 0;
    await updateDoc(reviewRef, {
      likes: likes - 1,
    }).then(async () => {
      //console.log("[database.jsx]Decremented likes for review:", rev.reviewID);
      const userRef = doc(database, "users", userID, "likes", rev.reviewID);
      await deleteDoc(userRef); 
    });
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function checkIfLiked(userID, { rev }) {
  try {
    console.log("[database.jsx]Checking if user:", userID, "liked review:", rev.reviewID);
    const userRef = doc(database, "users", userID, "likes", rev.reviewID);
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
      console.log("[database.jsx]User has liked the review:", rev.reviewID);
      return true;
    } else {
      console.log("[database.jsx]User has not liked the review:", rev.reviewID);
    }
    return false;
  } catch (error) {
    console.error("Error: ", error);
  }
}

export async function achievementsUpdater() {
  // Placeholder for future implementation
}

export async function rankScoreIncrementer(points) {
  // Placeholder for future implementation
}

// Function to load user's favorite parks
export async function loadUserFavorites(uid) {
  try {
    const favoritesRef = collection(database, "users", uid, "favorites");
    const favoritesSnapshot = await getDocs(favoritesRef);
    const favorites = [];
    
    favoritesSnapshot.forEach((doc) => {
      favorites.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return favorites;
  } catch (error) {
    console.error("Error loading favorites:", error);
    return [];
  }
}

// Function to remove a favorite park
export async function removeFavoritePark(uid, parkId) {
  try {
    const favoriteRef = doc(database, "users", uid, "favorites", parkId);
    await deleteDoc(favoriteRef);
    return true;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return false;
  }
}
