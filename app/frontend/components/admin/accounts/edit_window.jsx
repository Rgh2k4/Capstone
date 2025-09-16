import { useState } from "react";

function Edit({ account, onClose }) {
  const [username, setUsername] = useState(account.username);
  const [password, setPassword] = useState(account.password);
  const [email, setEmail] = useState(account.email);

  function handleDelete() {
    alert("Account Deleted!");
    onClose();
  }

  function handleEdit() {
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
          value={username}
          onChange={setUsername}
          type="text"
          placeholder="Enter Username..."
          className="input"
        />
        <input
          value={password}
          onChange={setPassword}
          type="text"
          placeholder="Enter Password..."
          className="input"
        />
        <input
          value={email}
          onChange={setEmail}
          type="text"
          placeholder="Enter Email..."
          className="input"
        />
      </div>
      <p className=" mt-6 text-1xl">Acoount Created: {account.dateCreated}</p>
      <div>
        <button onClick={handleDelete} className="red-button">
          Delete
        </button>
        <button onClick={handleEdit}>Edit</button>
      </div>
    </div>
  );
}

export default Edit;
