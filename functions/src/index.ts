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
  uid?: string;
  newEmail?: string;
  newPassword?: string;
  role?: "Admin" | "User";
  note?: string;
};

export const adminEditUser = onCall(async (req) => {
  assertIsAdmin(req);

  const { uid, newEmail, newPassword, role, note } =
    ((req.data as AdminEditUserPayload) ?? {});

  if (!uid) throw new HttpsError("invalid-argument", "uid required.");
  const update: UpdateRequest = {};
  if (newEmail) update.email = newEmail;
  if (newPassword) update.password = newPassword;
  if (Object.keys(update).length) {
    await getAuth().updateUser(uid, update);
  }

  if (role !== undefined) {
    await getAuth().setCustomUserClaims(uid, { admin: role === "Admin" });
  }

  const db = getFirestore();
  const record = await getAuth().getUser(uid);
  const finalEmail = record.email || newEmail || "";

  await db.collection("users").doc(uid).set(
    {
      user_ID: uid,
      ...(finalEmail ? { email: finalEmail } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(note !== undefined ? { note } : {}),
    },
    { merge: true }
  );

  return { ok: true, email: finalEmail };
});
