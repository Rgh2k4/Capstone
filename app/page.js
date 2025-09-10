"use client";
import { useState } from 'react';
import Login from './frontend/login.jsx';
import MainMenu from './frontend/main_menu.jsx';

export default function Home() {

  const [pageScreen, setPageScreen] = useState(<Login handleLogin={handleLogin}/>);

  function handleLogin() {
    setPageScreen(<MainMenu />);
  }

  return (
    <div>
      {pageScreen}
    </div>
  );
}
