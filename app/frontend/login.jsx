"use client";
import { useState } from "react";
import { logIn } from "../backend/databaseIntegration.jsx";
import { Button, Input, PasswordInput } from "@mantine/core";
import { IconAt, IconInfoCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export default function Login({ handleLogin, handleSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, { toggle }] = useDisclosure(false);
  const [submited, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const icon = <IconInfoCircle />;

  function authentication(e) {
    setSubmitted(true);
    e.preventDefault();
    logIn(email, password).then((authenticated) => {
      if (authenticated) {
        handleLogin();
      }
      else {
      setErrorMessage("User does not exist or password is incorrect.");
      setSubmitted(false);
      setShowError(true);
      }
    });
  }

  return (
    <main className="flex flex-col items-center bg-gradient-to-b from-sky-300  to-sky-700 h-screen w-screen">
      <section className="w-256 m-16 flex-initial">
        <h1 className="text-8xl break-normal text-shadow-lg text-shadow-black text-center font-extrabold tracking-wide text-white drop-shadow-md">
          National Parks GPS
        </h1>
      </section>
      <section className="border-2 border-hidden w-124 h-1/2 bg-white rounded-md drop-shadow-2xl drop-shadow-blue-400">
        <form
          onSubmit={authentication}
          className="flex flex-col items-center m-12 space-y-8"
        >
          <Input.Wrapper className="w-full" size="md" label="Enter Email">
            <Input
              disabled={submited}
              size="md"
              placeholder="Your email adress"
              value={email}
              onChange={(event) => setEmail(event.currentTarget.value)}
              leftSection={<IconAt size={16} />}
            />
          </Input.Wrapper>
          <Input.Wrapper className="w-full" size="md" label="Enter Password">
            <PasswordInput
              disabled={submited}
              placeholder="Your password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              visible={visible}
              onVisibilityChange={toggle}
            />
            <p className=" mt-2 text-sm text-gray-500 hover:underline cursor-pointer"> Forgot password? </p>
          </Input.Wrapper>
          <div className=" flex flex-col justify-center items-center space-y-8">
            <div className=" flex flex-row justify-center space-x-8">
              <Button
                className="w-full"
                size="lg"
                type="submit"
                loading={submited}
                variant="filled"
              >
                Log in
              </Button>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSignUp}
                loading={submited}
                variant="filled"
              >
                Sign up
              </Button>
            </div>
            <Button
              size="lg"
              onClick={handleLogin}
              variant="filled"
              loading={submited}
            >
              Continue as guest
            </Button>
          </div>
        </form>
      </section>
      <div className=" flex justify-end items-center mt-10">
        {showError && toast.error("Login failed")}
      </div>
    </main>
  );
}
