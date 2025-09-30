"use client";
import { Button } from '@mantine/core';
import { useState } from "react";
import ParkDetails from "./components/park_window/park_details";
import ProfileMenu from "./components/profile/profile_menu";
import dynamic from "next/dynamic";
import UploadWindow from './components/park_window/upload_window.jsx';
import Modal from './components/Modal';
import { auth } from "../backend/databaseIntegration.jsx";
import { useEffect } from 'react';
const ParkMap = dynamic(() =>  import("../backend/mapFunction"), {
  ssr:false
});

export default function MainMenu( { onRouteToLogin, onRouteToDashboard } ) {
  
  const [overlay, setOverlay] = useState(false);
  const [uploadOpened, setUploadOpened] = useState(false);
  const [selectedPark, setSetselectedPark] = useState()
  const user = auth.currentUser;
  const adminEmails = ["amanibera@gmail.com", "marksteeve67@yahoo.com", "evinthomas67@gmail.com", "testaccount@email.com", "dasdasdasdas@gmai.com"];
  const isAdmin = user && adminEmails.includes(user.email);
  
  function viewParkDetails({park}) {
    setSetselectedPark({park})
    setOverlay(true);
  }

  function handleOpenUpload() {
    setOverlay(false);
    setUploadOpened(true);
  }

  function checkUser() {
    if (!user) {
      console.log("No user is logged in");
    } else {
      console.log("User is logged in:", user.email);
    }
  }

  useEffect(() => {
    checkUser();
  

  }, []);


    return (
        <main className="flex flex-col h-screen w-screen relative">
            <header className="w-screen p-2 flex justify-between items-center bg-blue-300">
                <h1 className="w-60 ml-18 text-2xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
                <input type="text" value="Search..." readOnly className="w-3xl pl-6 h-15 rounded-full text-neutral-950 bg-white border-2 border-gray-400"></input>
                <div className=" flex flex-row mr-24 space-x-8">
                  {user ? (
                    <>
                      {isAdmin && <Button size='lg' onClick={onRouteToDashboard}>Dashboard</Button>}
                      <ProfileMenu onRouteToLogin={onRouteToLogin}/>
                    </>
                    ) : (
                      <Button size='lg' onClick={onRouteToLogin}>Log in</Button>
                    )
                  }

                </div>
            </header>  
            <section className="h-screen w-full">
              
              <ParkMap viewParkDetails={viewParkDetails} />
              <Modal isVisible={overlay} onClose={() => setOverlay(false)}>
                <ParkDetails park={selectedPark} openButtonUpload={handleOpenUpload}/>
              </Modal>
              <Modal isVisible={uploadOpened} onClose={() => setOverlay(false)} >
                <UploadWindow onClose={() => setUploadOpened(false)} />
              </Modal>
            </section>
        </main>
    );

    
}
