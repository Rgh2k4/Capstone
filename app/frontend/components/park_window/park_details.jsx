"use client";

import Reviews from "./review_section";
import { useState, useEffect} from "react";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { database, auth } from "../../../backend/databaseIntegration";
import { ActionIcon, Button } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import MapFunction from "@/app/backend/mapFunction";
import { PullImage } from "@/app/backend/uploadStorage";

import { readData } from "@/app/backend/database";
import { Select } from "@mantine/core";
import { readReviewData, ReportUser } from "@/app/backend/database";


export default function ParkDetails({ selectedPark, openButtonUpload, computeRouteRef }) {
  console.log("Selected Park:", selectedPark);
  const [submited, setSubmitted] = useState(false);
  const [park, setPark] = useState(selectedPark ? selectedPark : null);
  const [review, setReview] = useState([]);
  const user = auth.currentUser;
  const [travelMode, setTravelMode] = useState("DRIVING");

  if (!park) return null;

  const handleRouteClick = async () => {
    if (!computeRouteRef.current || !park) return;
    
    try{
      console.log("---Before route: ", computeRouteRef.current);
      const result = await computeRouteRef.current(park);
      alert(`Distance: ${result.distance.toFixed(2)} km\nDuration: ${Math.round(result.duration)} mins`);
    } catch {
    console.error();
    alert("Error: could not compute route, try again later or try a different travel mode");
    }
  };

  //https://firebase.google.com/docs/reference/js/firestore_, https://firebase.google.com/docs/firestore/query-data/listen
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
      const user = auth.currentUser;
      if (!user || !park?.id) return;

      const favoriteRef = doc(database, "users", user.uid, "favorites", park.id);
      const favoriteSnap = await getDoc(favoriteRef);
      setIsFavorite(favoriteSnap.exists());
    }
    checkFavorite();
  }, [park, auth.currentUser]);

  async function toggleFavorite() {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to favorite a park.");
      return;
    }

    const favoriteRef = doc(database, "users", user.uid, "favorites", park.id);

    if (isFavorite) {
      await deleteDoc(favoriteRef);
      setIsFavorite(false);
    } else {
      await setDoc(favoriteRef, {
        Name_e: park.name,
        id: park.id,
        lat: park.location.lat,
        lng: park.location.lng
      });
      setIsFavorite(true);
    }
  }

  let wildlifePhotos = [];
  let hasImage = false;

  function checkImages(photos) {
    if (photos && photos[0]) hasImage = true;
  }

  function handleReport({ rev }) {
    ReportUser({ reportedUserID: rev.uid, reporterUserID: user.uid, reason: "Inappropriate content" }, {rev});
    alert(`${rev.displayName || "Anonymous"} has been reported.`);
  }

  const FavoriteButton = () => (
    <ActionIcon
      size={42}
      variant="default"
      aria-label="Favorite Location"
      onClick={toggleFavorite}
    >
      <IconHeart
        size={24}
        className={`text-xl transition-transform ${
          isFavorite ? "text-red-500 scale-110" : "text-gray-500"
        }`}
      />
    </ActionIcon>
  );

  async function loadReviews() {
    try {
      const pullReview = await readReviewData(park.name);
      setReview(pullReview);
    } catch(error) {
      console.error("Error: ", error);
    }  
  }

  useEffect(() => {
    loadReviews();
  }, [park])

  checkImages(wildlifePhotos);

  return (
    <div className=" ">
      <header className="flex flex-col">
        <img
          src="https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg"
          alt=""
          className="h-75"
        />
      </header>
      <main className="flex flex-col w-full px-22 justify-center items-center">

        <section className="my-20 place-self-center">
          <h1 className="font-bold text-2xl">Ratings</h1>
        </section>
        <section className="flex flex-col items-center text-justify mb-8">
          <h1 className="font-extrabold text-2xl mb-22 flex items-center gap-2">
            {park.name}
            <FavoriteButton />
          </h1>
          <p className="w-3/4 mb-22">
            {park.description || "No description available."}
          </p>


          {/*This was made with the help of https://developers.google.com/maps/documentation/javascript/examples/directions-travel-modes#maps_directions_travel_modes-javascript & 
          https://mantine.dev/core/select/#combobox, and debugging with the help of gpt*/}
          <Select
          label="Travel Mode"
          value={travelMode}
          onChange={(value) => setTravelMode(value)}
          data={[
            {value: "DRIVING", label:"Driving"},
            {value:"WALKING", label:"Walking"},
            {value:"BICYCLING", label:"Bicycling"},
            {value:"TRANSIT", label: "Transit"}
          ]}
          />

          <Button
          variant="gradient"
          gradient={{ from: 'pink', to: 'grape', deg: 90 }}
          onClick={()=>{
            console.log("Button clicked!");
          handleRouteClick();}}
          >
            Compute Route
          </Button>

        </section>

        <section className="flex flex-col items-center">
          <h1 className="font-bold text-xl mb-15">Wildlife</h1>
          <div className="flex">
            {hasImage && (
              <div>
                <ul className="flex flex-row justify-center bg-gray-100 rounded-lg shadow-inner p-4 space-x-8 overflow-x-auto max-h-[500px]">
                  {/*{wildlifePhotos.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={img}
                      className="w-50 h-50 bg-gray-400 rounded"
                    />
                  ))}*/}
                  
                </ul>
              </div>
            )}
          </div>
        </section>
        <section className="mt-30 place-self-center">
          <Button
            className="w-full"
            size="lg"
            loading={submited}
            variant="filled"
            onClick={openButtonUpload}
          >
            Write a review
          </Button>
        </section>
        <section className="flex flex-col mt-30 items-center">
          <h1 className="font-bold text-2xl mb-10">Reviews</h1>
          <div className="rounded-md p-6 w-full bg-gray-100 shadow-inner max-h-96 overflow-y-auto">
            {review?.length > 0 ? (
              <ul>
                {review.map((rev, index) => (
                  <div key={index} className="">
                    <div className="flex flex-row gap-0 mx-4 my-18 space-x-6">
                      <div className="">
                        <img
                          className="w-25 h-25 bg-gray-400 rounded-full"
                          alt="profile picture"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className=" flex flex-row space-x-2 items-center">
                          <p className=" font-semibold text-1xl">
                            {rev.displayName || "Anonymous"}
                          </p>
                          <p className=" text-1xl italic">- {rev.dateSubmitted}</p>
                        </div>
                        <p className=" text-1xl">{rev.title}</p>
                        {rev.reviewData.image && (
                          <ul className="flex flex-row justify-center bg-gray-100 rounded-lg shadow-inner p-2 space-x-8 overflow-x-auto">
                            <PullImage location={park.name.split(' ').join('')} url={rev.reviewData.image} />
                          </ul>
                        )}
                        <div className="grid grid-cols-3">
                          <p className=" col-span-2">{rev.reviewDatamessage}</p>
                          <p
                            className="hover:underline italic flex justify-end items-end"
                            onClick={() => handleReport({ rev })}
                          >
                            Report User
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ul>
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
        </section>
        <footer className="mt-30 mb-20 place-self-center">
          <button>Back to top</button>
        </footer>
      </main>
    </div>
  );
}
