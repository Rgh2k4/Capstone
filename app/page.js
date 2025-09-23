"use client";
import { useState } from 'react';
import Login from './frontend/login.jsx';
import MainMenu from './frontend/main_menu.jsx';
import SignupPage from './frontend/signup.jsx';

export default function Home() {

  const [pageScreen, setPageScreen] = useState(<Login handleLogin={handleLogin} handleSignUp={handleSignUp}/>);

  function handleLogin() {
    setPageScreen(<MainMenu onRouteToLogin={handleRouteToLogin} />);
  }

  function handleSignUp() {
    setPageScreen(<SignupPage signUp={handleNewAccount} />);
  }

  function handleNewAccount() {
    setPageScreen(<MainMenu onRouteToLogin={handleRouteToLogin} />);
  }

  
  function handleRouteToLogin(params) {
    setPageScreen(<Login handleLogin={handleLogin} handleSignUp={handleSignUp}/>);
  }

  return (
    <div>
      {pageScreen}
    </div>
  );
}
