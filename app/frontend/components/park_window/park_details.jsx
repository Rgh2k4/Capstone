"use client";

import Reviews from "./review_section";
import { useState, useEffect, useRef } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { database as db, auth } from "../../../backend/databaseIntegration";
import { ActionIcon, Button } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import MapFunction from "@/app/backend/mapFunction";
import { PullImage } from "@/app/backend/uploadStorage";

export default function ParkDetails({ selectedPark, openButtonUpload, computeRoute }) {
  console.log("Selected Park:", selectedPark);
  const [submited, setSubmitted] = useState(false);
  const [park, setPark] = useState(selectedPark ? selectedPark : null);
  const computeRouteRef = useRef(null);

  if (!park) return null;

  const handleRouteClick = async () => {
    if (!computeRouteRef.current || !park) return;
    
    const result = await computeRouteRef.current(park);
    if (result)
      alert(`Distance: ${result.distance} km\nDuration: ${result.duration}`);
    };

  //https://firebase.google.com/docs/reference/js/firestore_, https://firebase.google.com/docs/firestore/query-data/listen
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
      const user = auth.currentUser;
      if (!user || !park?.id) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const favorites = userSnap.data().favorites || [];
        setIsFavorite(favorites.includes(park.id));
      }
    }
    checkFavorite();
  }, [park]);

  async function toggleFavorite() {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to favorite a park.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    //This code creates the user doc if the user doesnt have one yet
    if (!userSnap.exists()) {
      await setDoc(userRef, { favorites: [] });
    }

    if (isFavorite) {
      await updateDoc(userRef, {
        favorites: arrayRemove(park.id),
      });
      setIsFavorite(false);
    } else {
      await updateDoc(userRef, {
        favorites: arrayUnion(park.id),
      });
      setIsFavorite(true);
    }
  }

  let wildlifePhotos = ["image_1.jpeg", "image_2.jpeg"];
  let hasImage = false;

  function checkImages(photos) {
    if (photos && photos[0]) hasImage = true;
  }

  function handleData({ user }) {
    alert(`${user.username} has been reported.`);
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

  checkImages(wildlifePhotos);

  return (
    <>
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
        <section className="flex flex-col items-center text-justify mb-20">
          <h1 className="font-extrabold text-2xl mb-10 flex items-center gap-2">
            {park.name}
            <FavoriteButton />
          </h1>
          <p className="w-3/4">
            {park.description || "No description available."}
          </p>
           <MapFunction computeRouteRef={computeRouteRef} />
          <Button
          variant="gradient"
          gradient={{ from: 'pink', to: 'grape', deg: 90 }}
          onClick={handleRouteClick}
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
                  <PullImage location={park.name.split(' ').join('')}/>
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
          <div className="rounded-md p-6 w-3/4">
            {park.reviews?.length > 0 ? (
              <ul>
                {park.reviews.map((user, index) => (
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
                            {user.displayName || "Anonymous"}
                          </p>
                          <p className=" text-1xl italic">- {user.date}</p>
                        </div>
                        {user.images && user.images.length > 0 && (
                          <ul className="flex flex-row justify-center bg-gray-100 rounded-lg shadow-inner p-2 space-x-8 overflow-x-auto">
                            {user.images.map((img, index) => (
                              <>
                                <img
                                  key={index}
                                  src={img}
                                  alt={img}
                                  className="w-30 h-30 bg-gray-400 rounded"
                                />
                              </>
                            ))}
                          </ul>
                        )}
                        <div className="grid grid-cols-3">
                          <p className=" col-span-2">{user.comment}</p>
                          <p
                            className="hover:underline italic flex justify-end items-end"
                            onClick={() => handleData({ user })}
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
    </>
  );
}
