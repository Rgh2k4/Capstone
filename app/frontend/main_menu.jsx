"use client";


import { useState } from "react";
import ParkDetails from "./park_details";
import Upload from './upload.jsx';
import Modal from "./components/Modal";


export default function MainMenu() {
  const [overlay, setOverlay] = useState(false);

    return (
        <main className="flex flex-col h-screen w-screen relative">
            <header className="w-screen h-1/8 flex items-center bg-gray-300">
                <h1 className="w-90 ml-18 text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
                <input type="text" value="Search" readOnly className="ml-25 w-4xl h-15 pl-5 rounded-full text-neutral-950 bg-white"></input>
                <div className="">
                    <img className="w-25 h-25 bg-gray-400 rounded-full ml-18" alt="profile picture" />
                </div>
            </header>  
            <section>
                <button onClick={handleOpenOverlay} className="w-screen h-300">map</button>
            </section>
            <Modal isVisible={overlay} onClose={() => setOverlay(false)}>
                <ParkDetails />
            </Modal>
        </main>
    );

    
}
