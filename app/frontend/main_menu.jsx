"use client";
import { Button } from "@mantine/core";
import { useState } from "react";
import ParkDetails from "./components/park_window/park_details";
import ProfileMenu from "./components/profile/profile_menu";
import dynamic from "next/dynamic";
import UploadWindow from "./components/park_window/upload_window.jsx";
import Modal from "./components/Modal";
import { auth } from "../backend/databaseIntegration.jsx";
import { useEffect } from "react";
import { MultiSelect } from "@mantine/core";
import { getUniqueTypes } from "../backend/mapFunction";
import { GetUserData, isAdmin } from "../backend/database";

const MapFunction = dynamic(() => import("../backend/mapFunction"), {
  ssr: false,
});

export default function MainMenu( { onRouteToLogin, onRouteToDashboard}) {

  const [overlay, setOverlay] = useState(false);
  const [uploadOpened, setUploadOpened] = useState(false);
  const [selectedPark, setSelectedPark] = useState(null);
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  async function setupUser() {
    //console.log("Current user:", user);
    const email = auth.currentUser.email;
    GetUserData(user.uid).then((data) => {
      console.log("User Data:", data);
      console.log("Is Admin:", data.role === "Admin");
      if (data.role === "Admin") {
        setIsAdmin(true);
      }
      setUserData(data);
    });
  }

  const [upload, setUpload] = useState(false);

  const [uniqueTypes, setUniqueTypes] = useState({
    Accommodation_Type: [],
    Principal_type: [],
    Facility_Type_Installation: [],
    TrailDistance: [],
  });

  useEffect(() => {
    if (selectedFilters.length === 0 && uniqueTypes.Principal_type.length > 0) {
      const defaultFilter = uniqueTypes.Principal_type[0];
      setSelectedFilters([defaultFilter])
    }
  }, [uniqueTypes]);
  
  function viewParkDetails(park) {
    console.log("Viewing Park Details:", park);
    setSelectedPark(park);
    handleOpenOverlay();
  }
  function swapToParkDetails() {
    setUploadOpened(false);
    setOverlay(true);
  }

  function handleOpenOverlay() {
    setOverlay(true);
  }

  function handleOpenUpload() {
    setOverlay(false);
    setUploadOpened(true);
  }
    
    useEffect(() => {
      if (checkUser()) {
        console.log("User is logged in:", user.email);
        setupUser();
      } else {
        console.log("No user is logged in");
      }
    }, []);
    
    function checkUser() {
      if (!user) {
        return false;
      } else {
        return true;
      }
    }

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
    function normalizeOption(str) {
      if (typeof str !== "string") return str;
      //This removes slashes, duplications and whitespace
      const parts = [...new Set(str.split('/').map(s => s.trim()).filter(Boolean))];
      return parts.join(' / ');
    }
    
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    function uniqueCleanArray(arr) {
      const cleaned = arr
      .filter(Boolean)
      .map(v => normalizeOption(v))
      .map(String);
      return [...new Set(cleaned)];
    }
    
    function uniqueArray(arr) {
      return [...new Set(arr.map(normalizeOption))];
    }
    
    //This code ensures each unique subtype is only grabbed once total from all of the API's to prevent Mantine multiselect throwing an error
    //It was made with the help of gpt after asking it "How can I ensure each uniquesubtype is grabbed only once from all 4 of these apis?"
    function buildMultiSelectData(uniqueTypes) {
      const allValues = new Set();
      return [
        { 
      group: "Accommodations", 
      items: uniqueTypes.Accommodation_Type
        .map(normalizeOption)
        .filter(v => v && !allValues.has(v) && allValues.add(v)) 
      },
      { 
        group: "Principal Types", 
        items: uniqueTypes.Principal_type
          .map(normalizeOption)
          .filter(v => v && !allValues.has(v) && allValues.add(v)) 
      },
      { 
        group: "Facilities", 
        items: uniqueTypes.Facility_Type_Installation
          .map(normalizeOption)
          .filter(v => v && !allValues.has(v) && allValues.add(v)) 
      },
      { 
        group: "Trail Distance", 
        items: uniqueTypes.TrailDistance
          .map(normalizeOption)
          .filter(v => v && !allValues.has(v) && allValues.add(v)) 
        },
      ];
    }

    return (
        <main className="flex flex-col h-screen w-screen relative">
            <header className="w-screen p-2 flex justify-between items-center bg-blue-300 absolute top-0 z-10 shadow-md shadow-gray-600">
                <h1 className="w-60 ml-18 text-2xl break-normal font-bold text-white text-shadow-sm text-shadow-black text-center">
                    National Parks Information System
                </h1>
                <div className="">
                  <MultiSelect
                  size="md"
                  placeholder="Filter and search..."
                  searchable
                  className="w-3xl pl-6 rounded-full text-neutral-950 border-gray-400"
                  value={selectedFilters}
                  onChange={(newValue) =>{
                    if (newValue.length === 0) {
                      console.warn("At least one filter must remain active, this ensures a timely resonse from the site.");
                      return;
                    }
                    setSelectedFilters(newValue);
                  }}
                  data={buildMultiSelectData(uniqueTypes)}
                  />
                </div>
                <div className=" flex flex-row mr-24 space-x-8">
                  {userData ? (
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
            <Modal isVisible={overlay} onClose={() => setOverlay(false)}>
              <ParkDetails selectedPark={selectedPark} openButtonUpload={handleOpenUpload}/>
            </Modal>
            <Modal isVisible={uploadOpened} onClose={() => setUploadOpened(false)} >
              <UploadWindow onClose={swapToParkDetails} parkInfo={selectedPark} />
            </Modal>
              
              <section className="w-full">
                <MapFunction filters={selectedFilters} setUniqueTypes={setUniqueTypes} viewParkDetails={viewParkDetails} />
              </section>
        </main>
    );  
}