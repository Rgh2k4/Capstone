import { Button } from "@mantine/core";
import React, { useState } from "react";

function SettingsMenu({ onRouteToLogin, onChangeCredential, onDeleteAccount, onContactSupport }) {
  const [submited1, setSubmitted1] = useState(false);
  const [submited2, setSubmitted2] = useState(false);
  const [submited3, setSubmitted3] = useState(false);
  const [submited4, setSubmitted4] = useState(false);

  function handleChangeEmail() {
    setSubmitted1(true);
    onChangeCredential("email");
  }
  function handleChangePassword() {
    setSubmitted2(true);
    onChangeCredential("password");
  }
  function handleContact() {
    setSubmitted3(true);
    onContactSupport();
  }
  function handleDelete() {
    setSubmitted4(true);
    onDeleteAccount();
  }

  return (
    <div className=" flex flex-col justify-center items-center space-y-6 p-32">
      <div className=" mb-12">
        <h1 className=" text-5xl font-bold">Settings</h1>
      </div>
      <div>
        <Button
          size="lg"
          type="submit"
          variant="filled"
          loading={submited1}
          onClick={handleChangeEmail}
        >
          Change Email
        </Button>
      </div>
      <div>
        <Button
          size="lg"
          type="submit"
          variant="filled"
          loading={submited2}
          onClick={handleChangePassword}
        >
          Change Password
        </Button>
      </div>
      <div>
        <Button
          size="lg"
          type="submit"
          variant="filled"
          loading={submited3}
          onClick={handleContact}
        >
          Contact Us
        </Button>
      </div>
      <div>
        <Button
          size="lg"
          type="submit"
          variant="filled"
          loading={submited4}
          onClick={handleDelete}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}

export default SettingsMenu;
