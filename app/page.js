"use client";
import { useEffect, useState } from "react";
import Login from "./frontend/login.jsx";
import MainMenu from "./frontend/main_menu.jsx";
import SignupPage from "./frontend/signup.jsx";
import AdminMenu from "./frontend/admin_menu.jsx";
import { auth } from "./backend/databaseIntegration.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { Loader } from "@mantine/core";
import { GetUserData } from "./backend/database.jsx";

export default function Home() {
  const user = auth.currentUser;
  const [pageScreen, setPageScreen] = useState(null);

  function handleLogin() {
    setPageScreen(null);
    setPageScreen(
      <MainMenu
        onRouteToLogin={handleRouteToLogin}
        onRouteToDashboard={handleRouteToDashboard}
      />
    );
  }
  function handleSignUp() {
    setPageScreen(null);
    setPageScreen(<SignupPage handleNewAccount={handleNewAccount} />);
  }
  function handleNewAccount() {
    setPageScreen(null);
    setPageScreen(
      <MainMenu
        onRouteToLogin={handleRouteToLogin}
        onRouteToDashboard={handleRouteToDashboard}
      />
    );
  }
  function handleRouteToDashboard() {
    setPageScreen(null);
    setPageScreen(
      <AdminMenu
        onRouteToLogin={handleRouteToLogin}
        onRouteToMainMenu={handleLogin}
      />
    );
  }
  function handleRouteToLogin() {
    setPageScreen(
      <Login handleLogin={handleLogin} handleSignUp={handleSignUp} />
    );
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
          setTimeout(() => {
          handleLogin();
        }, 100);
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

  return <div className="h-screen">{pageScreen}</div>;
}
