"use client";
/*
  I reference w3school for the method that I used
  also referencing ChatGPT for generating the onChange function
  https://www.w3schools.com/react/react_forms.asp
  https://chat.openai.com/share/1f3f3e5e-1dcb-4f0a-8f7b-1c8e4e3b8f6e  
*/
import { useState } from "react";
import { auth, signUp } from "../backend/databaseIntegration.jsx";
import { Button, Input, PasswordInput, Checkbox } from "@mantine/core";
import { IconAt, IconInfoCircle } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import toast from "react-hot-toast";

export default function SignupPage({ handleNewAccount }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });
  const [visible, { toggle }] = useDisclosure(false);
  const [submited, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const icon = <IconInfoCircle />;

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setShowError(false);

    try {
      if (form.password !== form.confirm) {
        setSubmitted(false);
        setShowError(true);
        throw new Error("Passwords do not match");
      }
      if (signUp(form.email, form.password)) {
        handleNewAccount();
      } else {
        throw new Error("Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setErrorMessage(error.message);
      setSubmitted(false);
      setShowError(true);
    };
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-300  to-sky-700  flex flex-col justify-center items-center space-y-6">
      <h1 className="text-8xl break-normal  text-shadow-lg text-shadow-black text-center font-extrabold tracking-wide text-white drop-shadow-md">
        Sign up
      </h1>

      <section className="mt-10 w-1/3 max-w-5xl rounded-2xl bg-white p-8 shadow-lg">
        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Input.Wrapper className="w-full" size="md" label="Enter Email">
              <Input
                disabled={submited}
                size="md"
                name="email"
                type="email"
                placeholder="Enter Email..."
                value={form.email}
                onChange={onChange}
                leftSection={<IconAt size={16} />}
                required
              />
            </Input.Wrapper>
            <Input.Wrapper className="w-full" size="md" label="Enter Password">
              <PasswordInput
                disabled={submited}
                size="md"
                name="password"
                type="password"
                placeholder="Enter Password..."
                value={form.password}
                onChange={onChange}
                visible={visible}
                onVisibilityChange={toggle}
                required
              />
            </Input.Wrapper>
            <Input.Wrapper className="w-full" size="md" label="Enter Password">
              <PasswordInput
                disabled={submited}
                size="md"
                name="confirm"
                type="password"
                placeholder="Confirm Password..."
                value={form.confirm}
                onChange={onChange}
                visible={visible}
                onVisibilityChange={toggle}
                required
              />
            </Input.Wrapper>
          </div>

          <div className="flex flex-col justify-center gap-6">
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <Checkbox
                name="terms"
                checked={form.terms}
                onChange={onChange}
                label="I have read and accept the terms of service"
                disabled={submited}
                required
              />
            </label>

            <Button
              className="w-full"
              size="lg"
              type="submit"
              loading={submited}
              variant="filled"
            >
              Sign up
            </Button>
          </div>
        </form>
      </section>
      <div className=" flex justify-end items-center mt-10">
        {showError && toast.error("Sign up failed")}
      </div>
    </main>
  );
}
