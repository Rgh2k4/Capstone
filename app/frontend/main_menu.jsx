"use client";
import { Button } from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import ParkDetails from "./components/park_window/park_details";
import ProfileMenu from "./components/profile/profile_menu";
import dynamic from "next/dynamic";
import UploadWindow from "./components/park_window/upload_window.jsx";
import Modal from "./components/Modal";
import { auth, database } from "../backend/databaseIntegration.jsx";
import { MultiSelect, Notification, Accordion, MantineProvider, createTheme } from "@mantine/core";
import { GetUserData, isAdmin } from "../backend/database";
import { collection, getDocs } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import LoadingScreen from "./components/LoadingScreen";

const MapFunction = dynamic(() => import("../backend/mapFunction"), {
  ssr: false,
});

export default function MainMenu({ onRouteToLogin, onRouteToDashboard }) {
  const [overlay, setOverlay] = useState(false);
  const [uploadOpened, setUploadOpened] = useState(false);
  const [selectedPark, setSelectedPark] = useState(null);
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const computeRouteRef = useRef(null);
  const clearRouteRef = useRef(null);
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [favorites, setFavorites] = useState([]);
  const [routeSummaries, setRouteSummaries] = useState([]);
  const [isComputing, setIsComputing] = useState(false);
  const [loadingMarkers, setLoadingMarkers] = useState(true);
  const [defaultFilterApplied, setDefaultFilterApplied] = useState(false);

  const handleStopRoute = () => {
    if (clearRouteRef.current) {
      clearRouteRef.current();
    } else {
      toast.error("Route not ready yet, please wait a moment");
      console.warn("clearRouteRef not ready");
    }
    setRoutePois([]);
    setRouteSummaries([]);
    setIsComputing(false);
  };

  const onRouteSummary = (newSummary) => {
    setRouteSummaries(prev => {
      const updated = [...prev, newSummary];
      return updated.slice(-5);
    });
  };

  const showToast = (message, type = "success") => {
    if (type === "success") toast.success(message);
    else toast.error(message);
  };

  async function setupUser() {
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

  async function refreshFavorites() {
    const user = auth.currentUser;
    if (!user) return [];

    const favsRef = collection(database, "users", user.uid, "favorites");
    const snapshot = await getDocs(favsRef);
    const favIds = snapshot.docs.map((doc) => doc.id);

    setFavorites(favIds);

    return favIds;
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const favsRef = collection(database, "users", user.uid, "favorites");
      const snapshot = await getDocs(favsRef);
      const favs = snapshot.docs.map(doc => doc.id);
      setFavorites(favs);
    };
    fetchFavorites();
  }, []);

  const [upload, setUpload] = useState(false);

  const [uniqueTypes, setUniqueTypes] = useState({
    Accommodation_Type: [],
    Principal_type: [],
    CONCISCODE: [],
    PARKTYPE: [],
    Facility_Type_Installation: [],
    TrailDistance: [],
  });

  const [routePois, setRoutePois] = useState([]);


  //This code was changed to add the default filter right after the first data was pulled to avoid crashing the site trying to render 16000+ markers at once
  useEffect(() => {

    if (selectedFilters.length === 0) {
      const catagories = [
        uniqueTypes.Accommodation_Type,
        uniqueTypes.CONCISCODE,
        uniqueTypes.Principal_type,
        uniqueTypes.Facility_Type_Installation,
        uniqueTypes.TrailDistance,
      ];

      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
      const firstType = catagories.find(
        (arr) => Array.isArray(arr) && arr.length > 0
      );

      if (firstType) {
        const defaultFilter = firstType[0];
        setSelectedFilters([defaultFilter]);

        if (!defaultFilterApplied) {
          setDefaultFilterApplied(true);
          setLoadingMarkers(false);
        }
      }
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
    const parts = [
      ...new Set(
        str
          .split("/")
          .map((s) => s.trim())
          .filter(Boolean)
      ),
    ];
    return parts.join(" / ");
  }

  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  function uniqueCleanArray(arr) {
    const cleaned = arr
      .filter(Boolean)
      .map((v) => normalizeOption(v))
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
        items: uniqueTypes.Accommodation_Type.map(normalizeOption).filter(
          (v) => v && !allValues.has(v) && allValues.add(v)),
      },
      {
        group: "Principal Types",
        items: uniqueTypes.Principal_type.map(normalizeOption).filter(
          (v) => v && !allValues.has(v) && allValues.add(v)),
      },
      {
        group: "Facilities",
        items: uniqueTypes.Facility_Type_Installation.map(normalizeOption).filter(
          (v) => v && !allValues.has(v) && allValues.add(v)),
      },
      {
        group: "CONSICODE",
        items: uniqueTypes.CONCISCODE.map(normalizeOption).filter(
          (v) => v && !allValues.has(v) && allValues.add(v)),
      },
      {
        group: "Trail Distance",
        items: uniqueTypes.TrailDistance.map(normalizeOption).filter(
          (v) => v && !allValues.has(v) && allValues.add(v)),
      },
      {
        group: "Provincial Parks",
        items: uniqueTypes.PARKTYPE.map(normalizeOption).filter(
          (v) => v && !allValues.has(v) && allValues.add(v)),
      },
      {
        group: "Favorites",
        items: ["Favorites"],
      },
    ];
  }

  return (
    <>
      {loadingMarkers && <LoadingScreen />}
      <Toaster position="top-middle" reverseOrder={false} />
      <main className="flex flex-col h-screen w-screen relative">
        <header className="w-full flex items-center justify-between bg-gradient-to-r from-green-700 to-blue-500 px-8 py-3 shadow-lg shadow-gray-700/40 fixed top-0 z-50">
          <h1 className="text-2xl font-extrabold tracking-wide text-white drop-shadow-md">
            National Parks GPS
          </h1>
          <div className="">
            <MultiSelect
              size="md"
              placeholder="Filter and search..."
              searchable
              className="w-3xl pl-6 rounded-full text-neutral-950 border-gray-400"
              value={selectedFilters}
              onChange={(newValue) => {
                if (newValue.length === 0) {
                  <Notification color="pink" title="Warning">
                    At least one filter must remain active, this ensures a timely resonse from the site.
                  </Notification>
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
                <ProfileMenu onRouteToLogin={onRouteToLogin} userData={userData} />
              </>
            ) : (
              <Button size='lg' onClick={onRouteToLogin}>Log in</Button>
            )
            }

          </div>
        </header>

        <div className="absolute top-16 left-4 z-40 w-96 shadow-lg bg-white rounded-md p-2"
          style={{ display: routePois.length > 0 && routeSummaries.length > 0 ? "block" : "none" }}>
          <Accordion multiple defaultValue={['stop-route']}>
            <Accordion.Item value="stop-route">
              <Accordion.Control>Stop Computing Route</Accordion.Control>
              <Accordion.Panel>
                <Button color="red" size="sm" onClick={handleStopRoute}>
                  Stop Computing Route
                </Button>
              </Accordion.Panel>
            </Accordion.Item>

            {routeSummaries.map((route, index) => (
              <Accordion.Item key={index} value={`route-${index}`}>
                <Accordion.Control>Trip Summary #{index + 1}</Accordion.Control>
                <Accordion.Panel>
                  {(route.legs || []).map((leg, i) => (
                    <div key={i} className="mb-1 text-sm">
                      {leg.start} → {leg.end}: {leg.distanceText}, {leg.durationText}
                    </div>
                  ))}
                  <div className="mt-2 font-semibold text-sm">
                    Total Distance: {route.totalDistance.toFixed(1)} km
                    <br />
                    Total Duration: {Math.round(route.totalDuration)} min
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>



        <Modal isVisible={overlay} onClose={() => setOverlay(false)}>
          <ParkDetails
            selectedPark={selectedPark}
            openButtonUpload={handleOpenUpload}
            computeRouteRef={computeRouteRef}
            travelMode={travelMode}
            setTravelMode={setTravelMode}
            onClose={() => setOverlay(false)}
            routePois={routePois}
            setRoutePois={setRoutePois}
            showToast={showToast}
            favorites={favorites}
            onRouteSummary={onRouteSummary}
          />
        </Modal>
        <Modal isVisible={uploadOpened} onClose={() => setUploadOpened(false)} >
          <UploadWindow onClose={swapToParkDetails} parkInfo={selectedPark} />
        </Modal>

        <section className="w-full">
          <MapFunction
            filters={selectedFilters}
            favorites={favorites}
            setUniqueTypes={setUniqueTypes}
            viewParkDetails={viewParkDetails}
            computeRouteRef={computeRouteRef}
            clearRouteRef={clearRouteRef}
            travelMode={travelMode}
            routePois={routePois}
            setRoutePois={setRoutePois}
            normalizeOption={normalizeOption}
            onRouteSummary={onRouteSummary}
          />
        </section>
      </main>
    </>
  );
}
