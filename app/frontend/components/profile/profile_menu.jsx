"use client";

import { useState } from "react";
import ProfileWindow from "./profile_window";
import SettingsMenu from "./settings_menu";
import Modal from "../Modal";
import ChangeCredential from "./change_password";
import { Button } from "@mantine/core";
import { auth } from "../../../backend/databaseIntegration.jsx";

export default function ProfileMenu( { onRouteToLogin } ) {

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [credentialType, setCredentialType] = useState('');

  const user = auth.currentUser;
  const displayName = user.displayName ? user.displayName : "Annonymous";

  function handleLogout() {
    auth.signOut();
    onRouteToLogin();
  }

  function handleChangeDisplayName(newName) {
    user.displayName = newName;
    //console.log(user.displayName);
    return true;
  }

  function handleDeleteAccount() {
    user.delete();
    onRouteToLogin();
  }

  
  function handleChangeCredential(type) {
    setCredentialType(type);
    //onsole.log(type);
    
    setShowModal2(false);
    //console.log(showModal2);
    
    setShowModal3(true);
  }


  
  function handleSubmitCredential(value) {    
    setShowModal3(false);
  }
  
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <img
          src="/window.svg"
          alt="Profile"
          className="h-12 w-12 rounded-full bg-gray-300 object-cover"
        />
      </summary>
      <ul className="absolute right-0 z-50 mt-2 w-44 rounded-md bg-white p-1 shadow ring-1 ring-black/5">
        <li onClick={() => setShowModal(true)} className="block rounded px-3 py-2 hover:bg-gray-100">Profile</li>
        <li onClick={() => setShowModal2 (true)} className="block rounded px-3 py-2 hover:bg-gray-100">Settings</li>
        <li onClick={handleLogout} className="block rounded px-3 py-2 text-red-600 hover:bg-red-50">Logout</li>   
      </ul>

      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <ProfileWindow displayName={displayName} email={user.email} onChangeDisplayName={handleChangeDisplayName} />
      </Modal>
      <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}>
        <SettingsMenu onRouteToLogin={onRouteToLogin} onChangeCredential={handleChangeCredential} onDeleteAccount={handleDeleteAccount}/>
      </Modal>
      <Modal isVisible={showModal3} onClose={() => setShowModal3(false)}>
        <ChangeCredential type={credentialType} onSubmit={handleSubmitCredential}/>
      </Modal>
    </details>
  );
}
