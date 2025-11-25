import { auth } from "@/app/backend/databaseIntegration";
import { Button, Input, FileInput } from "@mantine/core";
import { sendEmailVerification } from "firebase/auth";
import { useState, useRef, useEffect } from "react";
import { uploadProfileImage, PullProfileImage } from "@/app/backend/uploadStorage";
import { pullProfileImageURL } from "@/app/backend/database";

function ProfileWindow({ onChangeDisplayName, displayName, email, dateCreated }) {
  const [name, setName] = useState(displayName);
  const [submited, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const fileInputRef = useRef(null);
  //console.log(displayName);
  //console.log(email);
  //console.log(dateCreated);
  
  const user = auth.currentUser;

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

    async function handleVerifyEmail() {
    await sendEmailVerification(user);
    setStatus("Verification email sent.");
  }

  function fileRefButton() {
    fileInputRef.current?.click();
  };

  function submitProfileImage(e) {
    const file = e.target.files[0];
    setProfileImage(file);
  }

  function updateProfileImage() {
    const imageURL = pullProfileImageURL(user);
    setImageName(imageURL);
    alert(imageName);

    if (profileImage != null) {
      uploadProfileImage(profileImage, user);
    }
  }

  useEffect(() => {
    updateProfileImage();
  }, [profileImage])

  return (
    <div className=" w-full p-24 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex flex-col items-center">
        <PullProfileImage user={user} imageName={imageName} />
        <input type="file" ref={fileInputRef} onChange={submitProfileImage} className="hidden" accept="image/*"
        />
        <Button 
          onClick={fileRefButton}
          size="lg"
          variant="filled"
          className="mt-8"
        >
          Change Profile Picture
        </Button>
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
        <p className=" mt-6 text-1xl font-semibold italic">Acoount Created: {dateCreated}</p>
        {!user.emailVerified && (
          <Button onClick={handleVerifyEmail} variant="outline" className="mt-4">
            Verify Email
          </Button>
        )}
      </div>
    </div>
  );
}

export default ProfileWindow;
