import { auth } from "@/app/backend/databaseIntegration";
import { Button } from "@mantine/core";
import React, { useState } from "react";
import { AdminEditUser, GetUserData } from "@/app/backend/database";

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

  return (
    <div className="">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Account Settings</h2>
          <p className="text-blue-100">
            Manage your account preferences and security
          </p>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 rounded-full p-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Account Management
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              size="md"
              variant="light"
              color="blue"
              loading={submited1}
              onClick={handleChangeEmail}
              leftSection={
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            >
              Change Email
            </Button>

            <Button
              size="md"
              variant="light"
              color="purple"
              loading={submited2}
              onClick={handleChangePassword}
              leftSection={
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
            >
              Change Password
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 rounded-full p-2">
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Support</h3>
          </div>

          <Button
            fullWidth
            size="md"
            variant="outline"
            color="green"
            loading={submited3}
            onClick={handleContact}
            leftSection={
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            }
          >
            Contact Support
          </Button>
        </div>


        <div className="border-t border-red-200 pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-red-100 rounded-full p-2">
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Danger Zone</h3>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> Deleting your account is permanent and
              cannot be undone. All your data will be lost.
            </p>
          </div>

          <Button
            fullWidth
            size="md"
            variant="filled"
            color="red"
            loading={submited4}
            onClick={handleDelete}
            leftSection={
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v4a1 1 0 11-2 0V7z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsMenu;
