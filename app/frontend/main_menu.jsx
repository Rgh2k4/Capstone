"use client";
import { useState } from 'react';
import ParkDetails from './park_details';

export default function MainMenu() {

    const [overlay, setOverlay] = useState(false);

    function handleOpenOverlay() {
        setOverlay(true);
    }

    function handleCloseOverlay() {
        setOverlay(false);
    }


    return (
        <main className="flex flex-col h-screen w-screen relative">
            <header className="w-screen h-1/8 flex items-center bg-gray-300">
                <h1 className="w-90 ml-18 text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
                <input type="text" value="Search" readOnly className="ml-25 w-4xl h-15 pl-5 rounded-full text-neutral-950 bg-white"></input>
            </header>
            {overlay ? 
            <div className='absolute inset-0 overflow-y-auto'>
                <ParkDetails closeButton={handleCloseOverlay}/>
            </div> : null
            }      
            <section>
                <button onClick={handleOpenOverlay} className="w-screen h-300">map</button>
            </section>
        </main>
    );

    
}