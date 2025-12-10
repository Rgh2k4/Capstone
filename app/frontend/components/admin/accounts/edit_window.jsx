import { AdminEditUser, EditUser, GetUserData } from "@/app/backend/database";
import { auth } from "@/app/backend/databaseIntegration";
import { Button, Input, Textarea, Alert, Divider } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState, useEffect } from "react";

function Edit({ account: uid, onClose, onDeleteAccount }) {
  const [account, setAccount] = useState({});
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submited, setSubmitted] = useState(false);
  const icon = <IconInfoCircle />;
  const user = auth.currentUser;

  useEffect(() => {
    const data = GetUserData(uid).then ((data) => {
      setAccount(data);
      setDisplayName(data.displayName);
      setEmail(data.email);
      setNote(data.note);
    })
  }, [])
  

  function handleDelete() {
    setShowError(false);
    onClose();
    toast.success("Account Deleted!");
    onDeleteAccount(account.user_ID);
  }

  function handleEdit() {
    if (!email.trim()) {
      setErrorMessage("Email is required!");
      setShowError(true);
      return;
    }
    if (user.email === email) {
      setErrorMessage("New email must be different from the current email!");
      setShowError(true);
      return;
    }
    const newAccountData = account;
    newAccountData.displayName = displayName;
    newAccountData.email = email;
    newAccountData.note = note;

    try {
      AdminEditUser(account, newAccountData);
      toast("Account Edited!");
      onClose();
    } catch (error) {
      setErrorMessage("Failed to edit user: " + error.message);
      setShowError(true);
      return;
    }
  }

  return (
    <div className="shadow-2xl rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Edit Account</h2>
          <p className="text-gray-100">Modify user account information</p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex justify-center">
          <div className="bg-gray-100 rounded-full p-4">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="space-y-6">
          <Input.Wrapper size="md" label="Email Address" required>
            <Input
              disabled={submited}
              size="md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter email address..."
              className="mt-1"
            />
          </Input.Wrapper>

          <Input.Wrapper size="md" label="Display Name">
            <Input
              disabled={submited}
              size="md"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              type="text"
              placeholder="Enter display name..."
              className="mt-1"
            />
          </Input.Wrapper>

          <Textarea
            label="Internal Note"
            description="Add notes about this user (visible to admins only)"
            placeholder="Enter internal notes..."
            minRows={4}
            value={note}
            onChange={(event) => setNote(event.currentTarget.value)}
          />
        </div>

        <Divider />

        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-500">
                  {account.dateCreated ? new Date(account.dateCreated.seconds * 1000).toLocaleDateString() : "Never"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900">Last Login</p>
                <p className="text-sm text-gray-500">
                  {account.lastLogin ? new Date(account.lastLogin.seconds * 1000).toLocaleDateString() : "Never"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 pt-6 border-t border-gray-200">
          <Button
            size="lg"
            variant="filled"
            color="red"
            className="flex-1 hover:bg-red-700 transition-colors duration-200"
            onClick={handleDelete}
            leftSection={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v4a1 1 0 11-2 0V7z" clipRule="evenodd" />
              </svg>
            }
          >
            Delete Account
          </Button>
          <Button
            size="lg"
            variant="filled"
            className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            onClick={handleEdit}
            loading={submited}
            leftSection={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            }
          >
            Save Changes
          </Button>
        </div>

        {showError && (
          <Alert
            variant="filled"
            color="red"
            withCloseButton
            title="Operation failed"
            icon={icon}
            onClose={() => setShowError(false)}
          >
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Edit;
