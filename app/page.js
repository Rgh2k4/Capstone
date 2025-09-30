"use client";
import { useState } from 'react';
import Login from './frontend/login.jsx';
import MainMenu from './frontend/main_menu.jsx';
import SignupPage from './frontend/signup.jsx';
import AdminMenu from './frontend/admin_menu.jsx';
import { auth } from "./backend/databaseIntegration.jsx";


export default function Home({ initialzeUser }) {

  const [pageScreen, setPageScreen] = useState(<Login handleLogin={handleLogin} handleSignUp={handleSignUp}/>);

  function handleLogin() {
    setPageScreen(<MainMenu onRouteToLogin={handleRouteToLogin} onRouteToDashboard={handleRouteToDashboard}/>);
  }

  function handleSignUp() {
    setPageScreen(<SignupPage handleNewAccount={handleNewAccount} />);
  }

  function handleNewAccount() {
    setPageScreen(<MainMenu onRouteToLogin={handleRouteToLogin} onRouteToDashboard={handleRouteToDashboard}/>);
  }

  function handleRouteToDashboard() {
    setPageScreen(<AdminMenu onRouteToLogin={handleRouteToLogin} onRouteToMainMenu={handleLogin}/>);
  }

  
  function handleRouteToLogin() {
    setPageScreen(<Login handleLogin={handleLogin} handleSignUp={handleSignUp}/>);
  }

  return (
    <div className='h-screen'>
      {pageScreen}
    </div>
  );
}
