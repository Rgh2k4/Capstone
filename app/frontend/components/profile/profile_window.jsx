import { Button, Input } from "@mantine/core";
import { useState } from "react";

function ProfileWindow({ onChangeDisplayName, displayName, email }) {
  const [name, setName] = useState(displayName || "Annonymous");
  const [submited, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");

  function handleChangeDisplayName(e) {
    e.preventDefault();
    const newName = name.trim();
    console.log(newName);
    if (!newName) {
      setStatus("Display name cannot be empty.");
      return;
    }
    setStatus("");
    setSubmitted(true);
    if (onChangeDisplayName(newName)) {
      setSubmitted(false);
      setStatus("Display name changed successfully.");
    }
    else {
      setSubmitted(false);
      setStatus("Failed to change display name.");
    }
  }

  return (
    <div className=" w-full p-24 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex flex-row justify-center text-center space-x-6 align-middle">
        <img
          className="w-50 h-50 bg-gray-400 rounded-full"
          alt="profile picture"
        />
      </div>
      <div className="flex flex-col space-y-6">
        {status && (
          <div className="bg-green-100 border border-green-300 text-green-800 p-3 rounded-lg">
            {status}
          </div>
        )}
        <form onSubmit={() => handleChangeDisplayName(event)} className=" grid grid-cols-2 justify-center items-center gap-6">
          <Input.Wrapper className="w-full" size="md" label="Display Name">
            <Input
              disabled={submited}
              size="lg"
              placeholder="Annonymous"
              value={name}
              onChange={(event) => setName(event.currentTarget.value)}
            />
          </Input.Wrapper>
          <Button
            size="lg"
            type="submit"
            variant="filled"
            loading={submited}
            className=" mt-6 h-12"
          >
            Change display name
          </Button>
        </form>
        <Input.Wrapper className="w-full" size="md" label="Email">
          <Input
            disabled
            size="md"
            value={email}
          />
        </Input.Wrapper>
        <p className=" mt-6 text-1xl font-semibold italic">Acoount Created: "dateCreated"</p>
      </div>
    </div>
  );
}

export default ProfileWindow;
