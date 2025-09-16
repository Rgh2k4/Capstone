"use client";
import { useState } from 'react';
import ParkDetails from './park_details';
import Upload from './upload.jsx';

export default function MainMenu() {

    const [overlay, setOverlay] = useState(false);
    const [upload, setUpload] = useState(false);

    function handleOpenOverlay() {
        setOverlay(true);
    }

    function handleCloseOverlay() {
        setOverlay(false);
    }

    function handleOpenUpload() {
        setOverlay(false);
        setUpload(true);
    }

    function handleCloseUpload() {
        setUpload(false);
    }


    return (
        <main className="flex flex-col h-screen w-screen relative">
            <header className="w-screen h-1/8 flex items-center bg-gray-300">
                <h1 className="w-90 ml-18 text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
                <input type="text" value="Search" readOnly className="ml-25 w-4xl h-15 pl-5 rounded-full text-neutral-950 bg-white"></input>
            </header>  
            <section>
                <button onClick={handleOpenOverlay} className="w-screen h-300">map</button>
            </section>
            {overlay ? 
            <div className='absolute inset-0 overflow-y-auto y-10'>
                <ParkDetails 
                closeButtonOverlay={handleCloseOverlay}                
                openButtonUpload={handleOpenUpload} />
            </div> : null
            }
            {upload ?
            <div className='absolute y-20'>
                <Upload closeButtonUpload={handleCloseUpload} />
            </div> : null
            }   
        </main>
    );

    
}