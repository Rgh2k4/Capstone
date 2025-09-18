"use client";

import { useState } from "react";
import ParkDetails from "./park_details";
import Upload from './upload.jsx';
import Modal from "./components/Modal";
import ProfileMenu from "./components/profile_menu";
import parkMap from "./mapFunction";

export default function MainMenu() {
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
            <header className="w-screen h-1/8 flex items-center bg-gray-300 justify-between">
                <h1 className="w-90 ml-18 text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
                <input type="text" value="Search" readOnly className="ml-25 w-4xl h-15 pl-5 rounded-full text-neutral-950 bg-white"></input>
                <ProfileMenu />
            </header>  
            <section>
              <parkMap />
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
