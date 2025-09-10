"use client";
import { useState } from 'react';

export default function MainMenu() {

    const [pageScreen, setPageScreen] = useState('map');

    function handleScreen() {
        setPageScreen('parkDetails');
    }

    if (pageScreen == 'map') {
        return (
        <main className="flex flex-col h-screen w-screen">
            <header className="w-screen h-1/8 flex items-center bg-gray-300">
                <h1 className="w-90 ml-18 text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
                    National Parks Information System
                </h1>
                <input type="text" value="Search" readOnly className="ml-25 w-4xl h-15 pl-5 rounded-full text-neutral-950 bg-white"></input>
            </header>
            <section>
                <button onClick={handleScreen} className="w-screen h-300">map</button>
            </section>
        </main>
    );
    }
    
}