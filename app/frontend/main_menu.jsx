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
import {MultiSelect} from "@mantine/core";
import {getUniqueTypes} from "../backend/mapFunction";
import { GetUserData, isAdmin } from '../backend/database';

const ParkMap = dynamic(() =>  import("../backend/mapFunction"), {
  ssr:false
});

export default function MainMenu( { onRouteToLogin, onRouteToDashboard} ) {

  const [overlay, setOverlay] = useState(false);
  const [uploadOpened, setUploadOpened] = useState(false);
  const [selectedPark, setSetselectedPark] = useState()
  const [isAdmin, setIsAdmin] = useState(false)
  const user = auth.currentUser;
  const userData = GetUserData(user.email).then(userData => {
    console.log("User Data:", userData);
    console.log("Is Admin:", userData.role === "Admin");
    if (userData.role === "Admin") {
      setIsAdmin(true)
    }
  });

  
  const [upload, setUpload] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState({
    Accommodation_Type: [],
    Principal_type: [],
    Facility_Type_Installation: [],
    TrailDistance:[],
  });
  
  function viewParkDetails({park}) {
    setSetselectedPark({park})
  }

  function handleOpenOverlay() {
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
                      <ProfileMenu onRouteToLogin={onRouteToLogin} userData={userData}/>
                    </>
                    ) : (
                      <Button size='lg' onClick={onRouteToLogin}>Log in</Button>
                    )
                  }

                </div>
            </header>  
            <section className="h-screen w-full">
              <Modal isVisible={overlay} onClose={() => setOverlay(false)}>
                <ParkDetails park={selectedPark} openButtonUpload={handleOpenUpload}/>
              </Modal>
              <Modal isVisible={uploadOpened} onClose={() => setOverlay(false)} >
                <UploadWindow onClose={() => setUploadOpened(false)} />
              </Modal>
            </section>
            
            <div className="p-4">
              <MultiSelect
              label="Filter Points of Interest"
              placeholder="Select filters..."
              searchable
              value={selectedFilters}
              onChange={setSelectedFilters}
              data={[
                {group: "Accommodations", items: uniqueTypes.Accommodation_Type},
                {group: "Principal Types", items: uniqueTypes.Principal_type},
                {group: "Facilities", items: uniqueTypes.Facility_Type_Installation },
                {group: "Trail Distance", items: uniqueTypes.TrailDistance},
              ]}/>
              </div>
              
              <section className="h-[700px] w-full">
                <ParkMap filters={selectedFilters} setUniqueTypes={setUniqueTypes} viewParkDetails={viewParkDetails} />
              </section>
        </main>
    );  
}
