"use client";

import { useState } from "react";
//import { signUp } from '../backend/databaseIntegration.jsx'

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    terms: false,
  });

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords do not match.");
      return;
    }
    //alert(`Signed up as ${form.email}`); //placeholder for real signup
    //signUp(form.email, form.password);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-500 flex flex-col items-center">
      <h1 className="mt-10 text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg">Sign up</h1>

      <section className="mt-10 w-full max-w-5xl rounded-2xl bg-white p-8 shadow-lg">
        <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <input
              name="email"
              type="email"
              placeholder="Enter Email..."
              value={form.email}
              onChange={onChange}
              className="w-full rounded-lg border px-4 py-3"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Enter Password..."
              value={form.password}
              onChange={onChange}
              className="w-full rounded-lg border px-4 py-3"
              required
            />
            <input
              name="confirm"
              type="password"
              placeholder="Confirm Password..."
              value={form.confirm}
              onChange={onChange}
              className="w-full rounded-lg border px-4 py-3"
              required
            />
          </div>

          <div className="flex flex-col justify-center gap-6">
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                name="terms"
                type="checkbox"
                checked={form.terms}
                onChange={onChange}
                required
                className="mt-1"
              />
              <span>
                I have read and accept the
                <br />
                terms of service
              </span>
            </label>

            <button
              type="submit"
              className="ml-auto w-[320px] rounded-lg bg-gray-300 px-6 py-4 text-2xl font-semibold text-black shadow hover:bg-gray-200"
            >
              Sign up
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
