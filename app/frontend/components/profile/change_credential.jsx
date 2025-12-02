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

  const handleSubmit = async () => {
    setSubmitted(true);
    setShowError(false);
    if (!currentPassword.trim()) {
      setErrorMessage("Current password is required.");
      setShowError(true);
      return;
    }
    if (!newValue.trim() || !confirmValue.trim()) {
      setErrorMessage(`Both ${label} fields are required.`);
      setShowError(true);
      return;
    }
    if (newValue !== confirmValue) {
      setErrorMessage(`${label}s do not match.`);
      setShowError(true);
      return;
    }

    try {
      await onSubmit({ currentPassword, newValue });
      onClose();
    } catch (error) {
      setErrorMessage(`${error.message || "An unexpected error occurred."}`);
      setShowError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-12 max-w-md mx-auto">
      <h2 className=" text-3xl font-semibold mb-6">Change {label}</h2>
      <div style={{ marginBottom: 16 }}>
        {type === "email" ? (
          <>            
            <Input.Wrapper className="w-full" size="md" label="Enter Email">
              <Input
                disabled={submited}
                size="md"
                placeholder={`New ${label}`}
                value={newValue}
                onChange={(event) => setNewValue(event.currentTarget.value)}
                leftSection={<IconAt size={16} />}
              />
            </Input.Wrapper>
            <Input.Wrapper className="w-full" size="md" label="Confirm Email">
              <Input
                disabled={submited}
                size="md"
                placeholder={`Confirm New ${label}`}
                value={confirmValue}
                onChange={(event) => setConfirmValue(event.currentTarget.value)}
                leftSection={<IconAt size={16} />}
              />
            </Input.Wrapper>
            <Input.Wrapper className="w-full" size="md" label="Password">
              <PasswordInput
                disabled={submited}
                size="md"
                placeholder={`Enter Current Password`}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.currentTarget.value)}
                visible={visible}
                onVisibilityChange={{ toggle }}
              />
            </Input.Wrapper>
          </>
        ) : (
          <>
            <Input.Wrapper className="w-full" size="md" label="Current Password">
                <PasswordInput
                  disabled={submited}
                  size="md"
                  placeholder={`Current ${label}`}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.currentTarget.value)}
                  visible={visible}
                  onVisibilityChange={{ toggle }}
                />
              </Input.Wrapper>
              <Input.Wrapper className="w-full" size="md" label="New Password">
                <PasswordInput
                  disabled={submited}
                  size="md"
                  placeholder={`New ${label}`}
                  value={newValue}
                  onChange={(event) => setNewValue(event.currentTarget.value)}
                  visible={visible}
                  onVisibilityChange={{ toggle }}
                />
              </Input.Wrapper>
            <Input.Wrapper className="w-full" size="md" label="Confirm Password">
              <PasswordInput
                disabled={submited}
                size="md"
                placeholder={`Confirm New ${label}`}
                value={confirmValue}
                onChange={(event) => setConfirmValue(event.currentTarget.value)}
                visible={visible}
                onVisibilityChange={{ toggle }}
              />
            </Input.Wrapper>
          </>
            
        )}
      </div>
      <Button size="lg" variant="filled" loading={submited} type="submit">
        Confirm Change
      </Button>
      <div className=" flex justify-end items-center mt-10">
        {showError && toast.error("Edit failed")}
      </div>
    </form>
  );
}
