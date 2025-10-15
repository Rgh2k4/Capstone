import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { getAuth, UpdateRequest } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();

function assertIsAdmin(req: CallableRequest) {
  if (!req.auth?.token?.admin) {
    throw new HttpsError("permission-denied", "Admins only.");
  }
}

//Grant email admin for once
const OWNER_EMAILS = new Set<string>(["morvenhau@gmail.com"]); //change if needed

export const setAdminClaim = onCall(async (req) => {
  const callerEmail = req.auth?.token?.email ?? "";
  if (!OWNER_EMAILS.has(callerEmail)) {
    throw new HttpsError("permission-denied", "Owners only.");
  }
  const { uid, isAdmin } = (req.data || {}) as { uid?: string; isAdmin?: boolean };
  if (!uid) throw new HttpsError("invalid-argument", "uid required.");
  await getAuth().setCustomUserClaims(uid, { admin: !!isAdmin });
  return { ok: true };
});

//Payload type
type AdminEditUserPayload = {
  uid: string;
  newEmail?: string;
  newPassword?: string;
  role?: "Admin" | "User";
  note?: string;
  prevEmail?: string;
};

//Update Auth and keep Firestore users/{email} in sync
export const adminEditUser = onCall(async (req) => {
  assertIsAdmin(req);

  const { uid, newEmail, newPassword, role, note, prevEmail } =
    (req.data || {}) as AdminEditUserPayload;

  if (!uid) throw new HttpsError("invalid-argument", "uid required.");

  //Auth update
  const update: UpdateRequest = {};
  if (newEmail) update.email = newEmail;
  if (newPassword) update.password = newPassword;
  if (Object.keys(update).length) {
    await getAuth().updateUser(uid, update);
  }

  //Custom claim from role
  if (role) {
    await getAuth().setCustomUserClaims(uid, { admin: role === "Admin" });
  }

  //Firestore sync
  const db = getFirestore();
  const record = await getAuth().getUser(uid);
  const finalEmail = record.email!;
  const targetRef = db.collection("users").doc(finalEmail);

  if (prevEmail && prevEmail !== finalEmail) {
    const prevRef = db.collection("users").doc(prevEmail);
    const prevSnap = await prevRef.get();
    if (prevSnap.exists) {
      const dataToWrite: Record<string, unknown> = { ...prevSnap.data(), email: finalEmail };
      if (role) dataToWrite.role = role;
      if (note !== undefined) dataToWrite.note = note;
      await targetRef.set(dataToWrite, { merge: true });
      await prevRef.delete();
    } else {
      await targetRef.set(
        { user_ID: uid, email: finalEmail, role: role ?? "User", note: note ?? "" },
        { merge: true }
      );
    }
  } else {
    await targetRef.set(
      {
        user_ID: uid,
        email: finalEmail,
        ...(role ? { role } : {}),
        ...(note !== undefined ? { note } : {}),
      },
      { merge: true }
    );
  }

  return { ok: true, email: finalEmail };
});
