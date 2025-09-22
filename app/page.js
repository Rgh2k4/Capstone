"use client";
import { useState } from 'react';
import Login from './frontend/login.jsx';
import MainMenu from './frontend/main_menu.jsx';
import SignupPage from './frontend/signup.jsx';

export default function Home() {

  const [pageScreen, setPageScreen] = useState(<Login handleLogin={handleLogin} handleSignUp={handleSignUp} />);

  function handleLogin() {
    setPageScreen(<MainMenu />);
  }

  function handleSignUp() {
    setPageScreen(<SignupPage handleNewAccount={handleCompleteSignUp} />);
  }

  function handleCompleteSignUp() {
    setPageScreen(<MainMenu />);
  }


  return (
    <div>
      {pageScreen}
    </div>
  );
}
