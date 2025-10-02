"use client";
import { useEffect, useState } from 'react';
import Login from './frontend/login.jsx';
import MainMenu from './frontend/main_menu.jsx';
import SignupPage from './frontend/signup.jsx';
import AdminMenu from './frontend/admin_menu.jsx';
import { auth } from "./backend/databaseIntegration.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { Loader } from '@mantine/core';


export default function Home() {
  const user = auth.currentUser;

  const [pageScreen, setPageScreen] = useState(null);

  function handleLogin(user) {
    setPageScreen(<MainMenu onRouteToLogin={handleRouteToLogin} onRouteToDashboard={handleRouteToDashboard} user={user}/>);
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


  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      handleLogin();
    } else {
      handleRouteToLogin();
    }
  });
    return () => unsubscribe();
  }, []);

  
  if (!pageScreen) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader size={150} />
      </div>
    );
  }

  return (
    <div className='h-screen'>
      {pageScreen}
    </div>
  );
}
