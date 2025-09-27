"use client";
import { Button } from '@mantine/core';
import { useState } from "react";
import ParkDetails from "./components/park_window/park_details";
import ProfileMenu from "./components/profile_menu";
import dynamic from "next/dynamic";
import UploadWindow from './components/park_window/upload_window.jsx';
import Modal from './components/Modal';
import { getAuth, onAuthStateChanged } from "firebase/auth";
const ParkMap = dynamic(() =>  import("../backend/mapFunction"), {
  ssr:false
});

export default function MainMenu( { onRouteToLogin, onRouteToDashboard } ) {
  
  const [overlay, setOverlay] = useState(false);
  const [uploadOpened, setUploadOpened] = useState(false);
  const [selectedPark, setSetselectedPark] = useState()

  function viewParkDetails({park}) {
    setSetselectedPark({park})
    setOverlay(true);
  }

  function handleOpenUpload() {
    setOverlay(false);
    setUploadOpened(true);
  }

    return (
        <main className="flex flex-col h-screen w-screen relative">
            <header className="w-screen p-6 flex justify-between items-center bg-blue-300">
                <h1 className="w-90 ml-18 text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
                <input type="text" value="Search..." readOnly className="w-3xl pl-6 h-15 rounded-full text-neutral-950 bg-white border-2 border-gray-400"></input>
                <div className=" flex flex-row mr-24 space-x-8">
                  {user ? (
                    <>
                      <Button size='lg' onClick={onRouteToDashboard}>Dashboard</Button>
                      <ProfileMenu onRouteToLogin={onRouteToLogin} user={user}/>
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
