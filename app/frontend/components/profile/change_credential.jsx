import { Button, Input, PasswordInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAt, IconInfoCircle } from "@tabler/icons-react";
import React, { useState } from "react";

export default function ChangeCredential({ type, onSubmit, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newValue, setNewValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [visible, { toggle }] = useDisclosure(false);
  const [submited, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const icon = <IconInfoCircle />;

  const label = type === "email" ? "Email" : "Password";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShowError(false);
    
    if (!currentPassword.trim()) {
      setErrorMessage("Current password is required.");
      setShowError(true);
      setSubmitted(false);
      return;
    }
    if (!newValue.trim() || !confirmValue.trim()) {
      setErrorMessage(`Both ${label.toLowerCase()} fields are required.`);
      setShowError(true);
      setSubmitted(false);
      return;
    }
    if (newValue !== confirmValue) {
      setErrorMessage(`${label}s do not match.`);
      setShowError(true);
      setSubmitted(false);
      return;
    }

    try {
      await onSubmit({ currentPassword, newValue });
      onClose();
    } catch (error) {
      setErrorMessage(`${error.message || "An unexpected error occurred."}`);
      setShowError(true);
      setSubmitted(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className={`bg-gradient-to-r ${type === 'email' ? 'from-blue-600 to-indigo-600' : 'from-purple-600 to-pink-600'} text-white p-8`}>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              {type === 'email' ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Change {label}</h2>
          <p className={`${type === 'email' ? 'text-blue-100' : 'text-purple-100'}`}>
            Update your account {label.toLowerCase()} securely
          </p>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {showError && (
            <Alert
              variant="light"
              color="red"
              withCloseButton
              title="Validation Error"
              icon={icon}
              onClose={() => setShowError(false)}
            >
              {errorMessage}
            </Alert>
          )}

          <Input.Wrapper size="md" label="Current Password" required>
            <PasswordInput
              disabled={submited}
              size="md"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.currentTarget.value)}
              visible={visible}
              onVisibilityChange={toggle}
            />
          </Input.Wrapper>

          {type === "email" ? (
            <>
              <Input.Wrapper size="md" label="New Email Address" required>
                <Input
                  disabled={submited}
                  size="md"
                  placeholder="Enter new email address"
                  type="email"
                  value={newValue}
                  onChange={(event) => setNewValue(event.currentTarget.value)}
                  leftSection={<IconAt size={16} />}
                />
              </Input.Wrapper>
              
              <Input.Wrapper size="md" label="Confirm New Email" required>
                <Input
                  disabled={submited}
                  size="md"
                  placeholder="Confirm new email address"
                  type="email"
                  value={confirmValue}
                  onChange={(event) => setConfirmValue(event.currentTarget.value)}
                  leftSection={<IconAt size={16} />}
                />
              </Input.Wrapper>
            </>
          ) : (
            <>
              <Input.Wrapper size="md" label="New Password" required>
                <PasswordInput
                  disabled={submited}
                  size="md"
                  placeholder="Enter new password"
                  value={newValue}
                  onChange={(event) => setNewValue(event.currentTarget.value)}
                  visible={visible}
                  onVisibilityChange={toggle}
                />
              </Input.Wrapper>
              
              <Input.Wrapper size="md" label="Confirm New Password" required>
                <PasswordInput
                  disabled={submited}
                  size="md"
                  placeholder="Confirm new password"
                  value={confirmValue}
                  onChange={(event) => setConfirmValue(event.currentTarget.value)}
                  visible={visible}
                  onVisibilityChange={toggle}
                />
              </Input.Wrapper>
            </>
          )}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Security Notice</p>
                <p className="text-sm text-yellow-700 mt-1">
                  {type === 'email' 
                    ? 'You will need to verify your new email address after changing it.'
                    : 'Make sure your new password is strong and unique.'
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 pt-4">
            <Button
              size="lg"
              variant="outline"
              onClick={onClose}
              disabled={submited}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              size="lg" 
              variant="filled" 
              loading={submited} 
              type="submit"
              className={`flex-1 ${type === 'email' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'} transition-colors duration-200`}
            >
              Update {label}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
