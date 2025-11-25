import { auth } from "@/app/backend/databaseIntegration";
import { Button, Input, Alert, Divider } from "@mantine/core";
import { sendEmailVerification } from "firebase/auth";
import { useState } from "react";

function ProfileWindow({
  onChangeDisplayName,
  displayName,
  email,
  dateCreated,
}) {
  const [name, setName] = useState(displayName);
  const [submited, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("success");

  const user = auth.currentUser;

  function handleChangeDisplayName(e) {
    e.preventDefault();
    const newName = name.trim();
    if (!newName) {
      setStatus("Display name cannot be empty.");
      setStatusType("error");
      return;
    }
    setStatus("");
    setSubmitted(true);
    if (onChangeDisplayName(newName)) {
      setSubmitted(false);
      setStatus("Display name changed successfully.");
      setStatusType("success");
    } else {
      setSubmitted(false);
      setStatus("Failed to change display name.");
      setStatusType("error");
    }
  }

  async function handleVerifyEmail() {
    try {
      await sendEmailVerification(user);
      setStatus("Verification email sent successfully.");
      setStatusType("success");
    } catch (error) {
      setStatus("Failed to send verification email.");
      setStatusType("error");
    }
  }

  return (
    <div className="overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12"
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
          </div>
          <h2 className="text-3xl font-bold mb-2">My Profile</h2>
          <p className="text-blue-100">Manage your personal information</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {status && (
          <Alert
            color={statusType === "success" ? "green" : "red"}
            variant="light"
            withCloseButton
            onClose={() => setStatus("")}
          >
            {status}
          </Alert>
        )}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
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
              Display Name
            </h3>
          </div>

          <form
            onSubmit={handleChangeDisplayName}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Input.Wrapper
              className="flex-1"
              size="md"
              label="Your display name"
            >
              <Input
                disabled={submited}
                size="md"
                placeholder="Enter your display name"
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
              />
            </Input.Wrapper>
            <Button
              size="md"
              type="submit"
              variant="filled"
              loading={submited}
              className="sm:mt-6 bg-blue-600 hover:bg-blue-700"
            >
              Update Name
            </Button>
          </form>
        </div>

        <Divider />
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 rounded-full p-2">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Account Information
            </h3>
          </div>

          <div className="grid gap-4">
            <Input.Wrapper size="md" label="Email Address">
              <div className="relative">
                <Input
                  disabled
                  size="md"
                  value={email}
                />
              </div>
              {
                    user.emailVerified ? (
                      <div className="flex items-start justify-end space-x-1">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-green-600">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-start justify-end space-x-1">
                        <svg
                          className="w-4 h-4 text-orange-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-orange-600">
                          Unverified
                        </span>
                      </div>
                    )
                  }
            </Input.Wrapper>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Account Created
                  </p>
                  <p className="text-sm text-gray-500">{dateCreated}</p>
                </div>
              </div>
            </div>
          </div>

          {!user.emailVerified && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-orange-600 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-800">
                    Email Verification Required
                  </p>
                  <p className="text-sm text-orange-700 mt-1">
                    Please verify your email address to access all features and
                    enhance account security.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    color="orange"
                    onClick={handleVerifyEmail}
                    className="mt-3"
                  >
                    Send Verification Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileWindow;
