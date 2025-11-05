import { AdminEditUser, EditUser, GetUserData } from "@/app/backend/database";
import { auth } from "@/app/backend/databaseIntegration";
import { Button, Input, Textarea } from "@mantine/core";
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
    alert("Account Deleted!");
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
      alert("Account Edited!");
      onClose();
    } catch (error) {
      setErrorMessage("Failed to edit user: " + error.message);
      setShowError(true);
      return;
    }
  }

  return (
    <div className=" p-24 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex justify-center text-center">
        <img
          className="w-50 h-50 bg-gray-400 rounded-full"
          alt="profile picture"
        />
      </div>
      <div className="flex flex-col space-y-6">
        <Input.Wrapper className="w-full" size="md" label="Email">
          <Input
            disabled={submited}
            size="md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Enter Email..."
          />
        </Input.Wrapper>
        <Input.Wrapper className="w-full" size="md" label="Display Name">
          <Input
            disabled={submited}
            size="md"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            type="text"
            placeholder="Enter Display Name..."
          />
        </Input.Wrapper>
        <Textarea
          label="Note"
          description="Internal note about the user"
          placeholder="Enter Note..."
          minRows={6}
          value={note}
          onChange={(event) => setNote(event.currentTarget.value)}
        />
      </div>
      <div className="flex flex-col space-y-6">
        <p className=" italic font-light text-gray-500">
          Account Created: {account.dateCreated ? new Date(account.dateCreated).toLocaleDateString() : "Never"}
        </p>
        <p className="italic font-light text-gray-500">
          Last Login: {account.lastLogin ? new Date(account.lastLogin).toLocaleDateString() : "Never"}
        </p>
      </div>
      <div className=" flex flex-row justify-between items-center space-x-6">
        <Button
          className="w-full"
          size="lg"
          variant="filled"
          color="red"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          className="w-full"
          size="lg"
          variant="filled"
          onClick={handleEdit}
        >
          Edit
        </Button>
      </div>
      <div className=" flex justify-end items-center mt-10">
        {showError && (
          <Alert
            variant="filled"
            color="red"
            withCloseButton
            title="Edit failed"
            icon={icon}
            onClick={() => setShowError(false)}
          >
            {errorMessage}
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Edit;
