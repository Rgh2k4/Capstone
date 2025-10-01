"use client";

import { useState } from "react";
import ParkDetails from "./park_details";
import Upload from './upload.jsx';
import Modal from "./components/Modal";
import ProfileMenu from "./components/profile_menu";
import dynamic from "next/dynamic";
import {MultiSelect} from "@mantine/core";

const ParkMap = dynamic(() =>  import("../backend/mapFunction"), {
  ssr:false
});
import {getUniqueTypes} from "../backend/mapFunction";

export default function MainMenu( { onRouteToLogin, onRouteToDashboard } ) {
  const [overlay, setOverlay] = useState(false);
  const [upload, setUpload] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState({
    Accommodation_Type: [],
    Principal_type: [],
    Facility_Type_Installation: [],
    TrailDistance:[],
  });

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
                <ParkMap filters={selectedFilters} setUniqueTypes={setUniqueTypes}/>
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
