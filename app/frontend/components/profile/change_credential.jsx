import { Button, Input } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAt, IconInfoCircle } from "@tabler/icons-react";
import React, { useState } from "react";

export default function ChangeCredential({ type, onSubmit }) {
  const [newValue, setNewValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [visible, { toggle }] = useDisclosure(false);
  const [submited, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const icon = <IconInfoCircle />;

  const label = type === "email" ? "Email" : "Password";

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showError(false);
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
    if (onSubmit) {
      onSubmit(newValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-12 max-w-md mx-auto">
      <h2 className=" text-3xl font-semibold mb-6">Change {label}</h2>
      <div style={{ marginBottom: 16 }}>
        {type === "email" ? (
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
        ) : (
          <Input.Wrapper className="w-full" size="md" label="Enter Password">
            <Input
              disabled={submited}
              size="md"
              placeholder={`New ${label}`}
              value={newValue}
              onChange={(event) => setNewValue(event.currentTarget.value)}
              visible={visible}
              onVisibilityChange={{ toggle }}
            />
          </Input.Wrapper>
        )}
      </div>
      <div style={{ marginBottom: 16 }}>
        {type === "email" ? (
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
        ) : (
          <Input.Wrapper className="w-full" size="md" label="Confirm Password">
            <Input
              disabled={submited}
              size="md"
              placeholder={`Confirm New ${label}`}
              value={confirmValue}
              onChange={(event) => setConfirmValue(event.currentTarget.value)}
              visible={visible}
              onVisibilityChange={{ toggle }}
            />
          </Input.Wrapper>
        )}
      </div>
      <Button size="lg" variant="filled" loading={submited} type="submit">
        Confirm Change
      </Button>
      <div className=" flex justify-end items-center mt-10">
        {showError && (
          <Alert
            variant="filled"
            color="red"
            withCloseButton
            title="Login failed"
            icon={icon}
            onClick={() => setShowError(false)}
          >
            {errorMessage}
          </Alert>
        )}
      </div>
    </form>
  );
}
