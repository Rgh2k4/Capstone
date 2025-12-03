"use client";

import { useState, useEffect } from "react";
import ProfileWindow from "./profile_window";
import SettingsMenu from "./settings_menu";
import Modal from "../Modal";
import ChangeCredential from "./change_credential";
import { Button } from "@mantine/core";
import { auth } from "../../../backend/databaseIntegration.jsx";
import { DeleteUser, EditUser } from "../../../backend/database.jsx";
import { SetDisplayName } from "@/app/backend/database";
import ContactWindow from "./contact_window";
import FavouritesList from "./favourites_list";
import { PullProfileImageIcon } from "@/app/backend/uploadStorage";
import { pullProfileImageURL } from "../../../backend/database.jsx";

export default function ProfileMenu({ onRouteToLogin, userData }) {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [credentialType, setCredentialType] = useState("");
  const [imageName, setImageName] = useState("");

  const user = auth.currentUser;

  function handleLogout() {
    auth.signOut();
    onRouteToLogin();
  }

  function handleChangeDisplayName(newName) {
    SetDisplayName(newName);
    userData.displayName = newName;
    setShowModal(false);
  }

  async function handleDeleteAccount() {
    const userDeleted = await DeleteUser();
    if (userDeleted) {
      onRouteToLogin();
    } else {
      alert("Account deletion failed. Please sign in again and retry.");
    }
  }

  function handleChangeCredential(type) {
    setCredentialType(type);
    setShowModal2(false);
    setShowModal3(true);
  }

  function handleContactSupport() {
    setShowModal2(false);
    setShowModal4(true);
  }

  function handleFavorites() {
    setShowModal5(true);
  }

  function handleSubmitCredential(value) {
    console.log("New Credential:", value);
    return EditUser(credentialType, value);
  }

  async function updateProfileImage() {
        const imageURL = await pullProfileImageURL(user);
        setImageName(imageURL);
      }
  
    useEffect(() => {
      if (user) {
        updateProfileImage();
      }
    }, [user]);

  return (
    <details className="relative">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        {/*<img
          src="/window.svg"
          alt="Profile"
          className="h-12 w-12 rounded-full bg-gray-300 object-cover"
        />*/}
        <PullProfileImageIcon user={user} imageName={imageName} />
      </summary>
      <ul className="absolute right-0 z-50 mt-2 w-44 rounded-md bg-white p-1 shadow ring-1 ring-black/5">
        <li
          onClick={() => setShowModal(true)}
          className="block rounded px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Profile
        </li>
        <li
          onClick={handleFavorites}
          className="block rounded px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Favorites
        </li>
        <li
          onClick={() => setShowModal2(true)}
          className="block rounded px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Settings
        </li>
        <li
          onClick={handleLogout}
          className="block rounded px-3 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
        >
          Logout
        </li>
      </ul>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <ProfileWindow
          email={userData.email}
          dateCreated={
            userData.dateCreated
              ? new Date(userData.dateCreated.seconds * 1000).toLocaleDateString()
              : "Unknown"
          }
          displayName={userData.displayName}
          onChangeDisplayName={handleChangeDisplayName}
        />
      </Modal>

      <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}>
        <SettingsMenu
          onRouteToLogin={onRouteToLogin}
          onChangeCredential={handleChangeCredential}
          onDeleteAccount={handleDeleteAccount}
          onContactSupport={handleContactSupport}
        />
      </Modal>

      <Modal isVisible={showModal3} onClose={() => setShowModal3(false)}>
        <ChangeCredential
          onClose={() => setShowModal3(false)}
          type={credentialType}
          onSubmit={handleSubmitCredential}
        />
      </Modal>

      <Modal isVisible={showModal4} onClose={() => setShowModal4(false)}>
        <ContactWindow
          type={credentialType}
          onSubmit={handleSubmitCredential}
          onClose={() => setShowModal4(false)}
        />
      </Modal>

      <Modal isVisible={showModal5} onClose={() => setShowModal5(false)}>
        <FavouritesList userData={userData} />
      </Modal>
    </details>
  );
}
