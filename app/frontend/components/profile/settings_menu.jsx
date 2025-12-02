import { auth } from "@/app/backend/databaseIntegration";
import { Button } from "@mantine/core";
import React, { useState } from "react";
import { AdminEditUser, GetUserData } from "@/app/backend/database";
<div><Toaster/></div>

function SettingsMenu({
  onRouteToLogin,
  onChangeCredential,
  onDeleteAccount,
  onContactSupport,
}) {
  const [submited1, setSubmitted1] = useState(false);
  const [submited2, setSubmitted2] = useState(false);
  const [submited3, setSubmitted3] = useState(false);
  const [submited4, setSubmitted4] = useState(false);
  const user = auth.currentUser;

  function handleChangeEmail() {
    if (user.emailVerified) {
      setSubmitted1(true);
      onChangeCredential("email");
    } else {
      toast("Please verify your email before changing credentials.");
    }
  }
  function handleChangePassword() {
    if (user.emailVerified) {
      setSubmitted2(true);
      onChangeCredential("password");
    } else {
      toast("Please verify your email before changing credentials.");
    }
  }
  function handleContact() {
    setSubmitted3(true);
    onContactSupport();
  }
  function handleDelete() {
    setSubmitted4(true);
    onDeleteAccount();
  }

  const [promoting, setPromoting] = useState(false);
  const [promoteError, setPromoteError] = useState("");
  const [promoteDone, setPromoteDone] = useState(false);

  async function handlePromoteToAdmin() {
    try {
      setPromoteError("");
      setPromoting(true);

      const uid = auth.currentUser?.uid;
      const email = auth.currentUser?.email;

      if (!uid || !email) {
        setPromoteError("No signed-in user found.");
        return;
      }

      const ok = await AdminEditUser({
        oldData: { user_ID: uid, email },
        newData: { role: "Admin", note: "Self-promoted via Settings" },
      });

      if (!ok) {
        setPromoteError("Failed to update role.");
        return;
      }

      await GetUserData(uid);
      setPromoteDone(true);
    } catch (e) {
      console.error(e);
      setPromoteError("Something went wrong.");
    } finally {
      setPromoting(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-6 p-12 bg-white/5 backdrop-blur-md rounded-2xl shadow-lg border border-white/10">
      <h1 className="text-4xl font-bold text-center mb-4">Settings</h1>
      <p className="text-center mb-6">Manage your account preferences below.</p>

      <div className="w-full flex flex-col space-y-4">
        <Button
          fullWidth
          size="md"
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          loading={submited1}
          onClick={handleChangeEmail}
        >
          Change Email
        </Button>

        <Button
          fullWidth
          size="md"
          variant="gradient"
          gradient={{ from: "violet", to: "pink" }}
          loading={submited2}
          onClick={handleChangePassword}
        >
          Change Password
        </Button>

        <Button
          fullWidth
          size="md"
          variant="light"
          color="blue"
          loading={submited3}
          onClick={handleContact}
        >
          Contact Support
        </Button>

        {promoteError && toast.error(
            {promoteError}
        )}
        {promoteDone && toast.success('Role updated. You’re now an Admin.')}
        <Button
          fullWidth
          size="md"
          variant="outline"
          color="green"
          loading={promoting}
          onClick={handlePromoteToAdmin}
          disabled={promoting || promoteDone}
        >
          Promote to Admin
        </Button>

        <div className="pt-2 border-t border-gray-700 mt-4">
          <Button
            fullWidth
            size="md"
            variant="filled"
            color="red"
            loading={submited4}
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsMenu;
