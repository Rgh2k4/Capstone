"use client";

import { useState } from "react";
import ParkDetails from "./park_details";
import Upload from './upload.jsx';
import Modal from "./components/Modal";
import ProfileMenu from "./components/profile_menu";
import ParkMap from "../backend/mapFunction";

export default function MainMenu( { onRouteToLogin, onRouteToDashboard } ) {
  const [overlay, setOverlay] = useState(false);
  const [upload, setUpload] = useState(false);

  function handleOpenOverlay() {
    setOverlay(true);
  }

  function handleOpenUpload() {
    setOverlay(false);
    setUpload(true);
  }

    return (
        <main className="flex flex-col h-screen w-screen relative">
            <header className="w-screen p-6 flex justify-between items-center bg-blue-300">
                <h1 className="w-90 ml-18 text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
                <input type="text" value="Search..." readOnly className="w-3xl pl-6 h-15 rounded-full text-neutral-950 bg-white border-2 border-gray-400"></input>
                <div className=" flex flex-row mr-24">
                  <button onClick={onRouteToDashboard}>Dashboard</button>
                  <ProfileMenu onRouteToLogin={onRouteToLogin} />

                </div>
            </header>  
            <section>
              <ParkMap />
            </section>

          {/*<Modal isVisible={overlay} onClose={() => setOverlay(false)}>
                <ParkDetails openButtonUpload={handleOpenUpload} />
            </Modal>
            <Modal isVisible={upload} onClose={() => setUpload(false)}>
                <Upload />
            </Modal>*/}
        </main>
    );

    
}
