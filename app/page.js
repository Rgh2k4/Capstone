"use client";
import { useState } from 'react';
import Login from './frontend/login.jsx';
import MainMenu from './frontend/main_menu.jsx';
import SignupPage from './frontend/signup.jsx';
import AdminMenu from './frontend/admin_menu.jsx';
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default function Home({ initialzeUser }) {

  const [pageScreen, setPageScreen] = useState(<Login handleLogin={handleLogin} handleSignUp={handleSignUp}/>);
  
  async function initialzeUser(auth) {
    const user = auth.currentUser;
  }



  function handleLogin() {
    
    setPageScreen(<MainMenu onRouteToLogin={handleRouteToLogin} onRouteToDashboard={handleRouteToDashboard}/>);
  }

  function handleSignUp() {
    setPageScreen(<SignupPage signUp={handleNewAccount} />);
  }

  function handleNewAccount() {
    setPageScreen(<MainMenu onRouteToLogin={handleRouteToLogin} onRouteToDashboard={handleRouteToDashboard}/>);
  }

  function handleRouteToDashboard() {
    setPageScreen(<AdminMenu onRouteToLogin={handleRouteToLogin} onRouteToMainMenu={handleLogin}/>);
  }

  
  function handleRouteToLogin(params) {
    setPageScreen(<Login handleLogin={handleLogin} handleSignUp={handleSignUp}/>);
  }

  return (
    <div className='h-screen'>
      {pageScreen}
    </div>
  );
}
