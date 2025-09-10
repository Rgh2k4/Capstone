"use client";
import { useState } from 'react';
import Login from './login.jsx';
import MainMenu from './main_menu.jsx';

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
