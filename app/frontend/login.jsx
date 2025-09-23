"use client";
import { useState } from "react";
import { logIn } from '../backend/databaseIntegration.jsx'

export default function Login({ handleLogin, handleSignUp }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function Email(e) {
      setEmail(e.target.value);
    }

    function Password(e) {
      setPassword(e.target.value);
    }

    function authentication(e) {
      e.preventDefault();
      logIn(email, password)
        .then(authenticated => {
          if (authenticated) {
            handleLogin();
          }       
        });
    }

    return (
        <main className="flex flex-col items-center bg-sky-300 h-screen w-screen">
            <section className="w-256 m-16 flex-initial">
                <h1 className="text-8xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
            </section>
            <section className="border-2 border-hidden w-124 h-90 bg-white rounded-md">
                <form onSubmit={authentication} className="flex flex-col items-center m-12">
                    <input type="text" placeholder="Enter Username..." value={email} onChange={Email} className="w-100 h-12 pl-4 mb-12 rounded mb-3 border-black border-1 text-neutral-950"></input>
                    <input type="password" placeholder="Enter Password..." value={password} onChange={Password} className="w-100 h-12 pl-4 mb-12 rounded mb-3 border-black border-1 text-neutral-950"></input>
                    <input type="submit" value="Log in" className="login"></input>
                </form>
            </section>
             <section className="mt-6 flex flex-col items-center gap-4">

        <button onClick={handleSignUp} className="mx-auto block w-[360px] rounded-lg bg-gray-300 px-6 py-4 text-2xl font-semibold text-black shadow hover:bg-gray-200">
          Sign up
        </button>

        <button
          type="button"
          onClick={handleLogin}
          className="mx-auto block w-[360px] rounded-lg bg-white px-6 py-4 text-2xl font-semibold text-black shadow hover:bg-gray-50"
        >
          Continue as guest
        </button>
      </section>
        </main>
    );
}