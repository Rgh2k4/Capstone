import { EditUser } from "@/app/backend/database";
import { auth } from "@/app/backend/databaseIntegration";
import { useState } from "react";

function Edit({ account, onClose, onDeleteAccount }) {
  const [displayName, setDisplayName] = useState(account.displayName);
  const [email, setEmail] = useState(account.email);
  const [note, setNote] = useState(account.note);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const user = auth.currentUser;

  function handleDelete() {
    setShowError(false);
    onClose();
    alert("Account Deleted!");
    onDeleteAccount(account.id);
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
      EditUser();
    } catch (error) {
      setErrorMessage("Failed to edit user: " + error.message);
      setShowError(true);
      return;
    } 
    alert("Account Edited!");
    onClose();
  }

  return (
    <div className=" p-12 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex justify-center text-center">
        <img
          className="w-50 h-50 bg-gray-400 rounded-full"
          alt="profile picture"
        />
      </div>
      <div className="flex flex-col space-y-6">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          placeholder="Enter Email..."
          className="input"
        />
        <input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          type="text"
          placeholder="Enter Display Name..."
          className="input"
        />
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Enter Note..."
          className="input h-32 resize-none"
        />
      </div>
      <p className=" mt-6 text-1xl">Account Created: {account.dateCreated}</p>
      <p className=" mt-6 text-1xl">Last Login: {account.lastLogin}</p>
      <div>
        <button onClick={handleDelete} className="red-button">
          Delete
        </button>
        <button onClick={handleEdit}>Edit</button>
      </div>
      <div className=" flex justify-end items-center mt-10">
        {showError && (<Alert
          variant="filled"
          color="red"
          withCloseButton
          title="Edit failed"
          icon={icon}
          onClick={() => setShowError(false)}
        >
          {errorMessage}
        </Alert>)}
      </div>
    </div>
  );
}

export default Edit;
