"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { database, auth } from "../../../backend/databaseIntegration";
import { ActionIcon, Button, Select, Divider } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { PullImage } from "@/app/backend/uploadStorage";
import { readReviewData, ReportUser } from "@/app/backend/database";

export default function ParkDetails({
  selectedPark,
  openButtonUpload,
  computeRouteRef,
  onClose,
  travelMode,
  setTravelMode,
  routePois,
  setRoutePois,
  showToast,
}) {
  const [submited, setSubmitted] = useState(false);
  const [park, setPark] = useState(selectedPark || null);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const user = auth.currentUser;

  if (!park) return null;

  //https://react-hot-toast.com/
  const handleRouteClick = async () => {
    if (!computeRouteRef.current || !park) return;
    try {
      const result = await computeRouteRef.current([park], travelMode);
      setRoutePois([park]);

      if (showToast) {
        showToast(`Distance: ${result.distance.toFixed(2)} km\nDuration: ${Math.round(result.duration)} mins`);
      }

      if (onClose) onClose(); 
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Could not compute route. Try again or use a different travel mode.", "error");
    }
  };

  useEffect(() => {
    async function checkFavorite() {
      const user = auth.currentUser;
      if (!user || !park?.id) return;

      const favoriteRef = doc(database, "users", user.uid, "favorites", park.id);
      const favoriteSnap = await getDoc(favoriteRef);
      setIsFavorite(favoriteSnap.exists());
    }
    checkFavorite();
  }, [park]);

  async function toggleFavorite() {
    if (!user) return alert("You must be logged in to favorite a park.");
    const favoriteRef = doc(database, "users", user.uid, "favorites", park.id);

    if (isFavorite) {
      await deleteDoc(favoriteRef);
      setIsFavorite(false);
    } else {
      await setDoc(favoriteRef, {
        Name_e: park.name,
        id: park.id,
        lat: park.location.lat,
        lng: park.location.lng,
      });
      setIsFavorite(true);
    }
  }

  const FavoriteButton = () => (
    <ActionIcon
      size={42}
      variant="subtle"
      aria-label="Favorite Location"
      onClick={toggleFavorite}
    >
      <IconHeart
        size={26}
        className={`transition-transform ${
          isFavorite ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-400"
        }`}
      />
    </ActionIcon>
  );

  async function loadReviews() {
    try {
      const pullReview = await readReviewData(park.name);
      setReviews(pullReview);
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [park]);

  function handleReport({ rev }) {
    if (!user) return alert("You must be logged in to report a user.");
    ReportUser(
      {
        reportedUserID: rev.reviewData.uid,
        reporterUserID: user.uid,
        reason: "Inappropriate content",
      },
      { rev }
    );
    alert(`${rev.displayName || "Anonymous"} has been reported.`);
  }

  const addToRoute = async (poi) => {
    if (routePois.length >= 5) return;
    if (routePois.some((p) => p.id === poi.id)) return;

    const newRoute = [...routePois, poi];
    setRoutePois(newRoute);
    
    try {
      const result = await computeRouteRef.current(newRoute, travelMode);
      
      if (showToast) {
        showToast(`Distance: ${result.distance.toFixed(2)} km\nDuration: ${Math.round(result.duration)} mins`);
      }

      if (onClose) onClose();

    } catch (err) {
      console.error(err);
      if (showToast) showToast("Could not compute route. Try again or use a different travel mode.", "error");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-md overflow-hidden">
      <header className="relative w-full h-72">
        <img
          src="https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg"
          alt="Park"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold">{park.name}</h1>
            <FavoriteButton />
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl px-8 py-10 space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">
            About the Park
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {park.description || "No description available."}
          </p>
        </section>

        <Divider />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Directions</h2>
          <Select
            label="Travel Mode"
            value={travelMode}
            onChange={(value) => setTravelMode(value)}
            data={[
              { value: "DRIVING", label: "Driving" },
              { value: "WALKING", label: "Walking" },
              { value: "BICYCLING", label: "Bicycling" },
              { value: "TRANSIT", label: "Transit" },
            ]}
          />
          <div className="flex gap-4">
            <Button
              variant="gradient"
              gradient={{ from: "blue", to: "cyan", deg: 60 }}
              onClick={handleRouteClick}
            >
              Compute New Route
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: "green", to: "teal", deg: 60 }}
              onClick={() => 
                {if (!routePois || routePois.length === 0) {
                  return notifications.show({
                    color: "red",
                    title: "Alert",
                    message: "You must start a route first before adding another location."
                  })
                }
                else addToRoute(park)}
              }
            >
              Add to Route
            </Button>
          </div>
        </section>

        <Divider />

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Wildlife
          </h2>
          <div className="bg-gray-100 border rounded-xl p-4 shadow-inner">
            <p className="text-gray-500 italic text-center">
              No wildlife images available.
            </p>
          </div>
        </section>

        <Divider />

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Reviews</h2>
            <Button
              size="md"
              variant="filled"
              gradient={{ from: "orange", to: "red", deg: 90 }}
              onClick={openButtonUpload}
            >
              Write a Review
            </Button>
          </div>

          <div className="bg-gray-50 border rounded-xl p-6 shadow-inner max-h-[400px] overflow-y-auto">
            {reviews?.length > 0 ? (
              <ul className="space-y-8">
                {reviews.map((rev, index) => (
                  <li key={index} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-start space-x-4">
                      <img
                        className="w-16 h-16 bg-gray-300 rounded-full"
                        alt="profile"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-lg text-gray-800">
                            {rev.displayName || "Anonymous"}
                          </p>
                          <p className="text-sm text-gray-500 italic">
                            {rev.dateSubmitted
                              ? rev.dateSubmitted
                                  .toDate()
                                  .toLocaleDateString()
                              : "Unknown Date"}
                          </p>
                        </div>
                        <p className="text-gray-700 mt-2">{rev.title}</p>
                        <p className="text-gray-600 mt-1 leading-relaxed">
                          {rev.reviewData.message}
                        </p>
                        {rev.reviewData.image && (
                          <div className="mt-4 bg-gray-100 rounded-lg p-2">
                            <PullImage
                              location={park.name.split(" ").join("")}
                              url={rev.reviewData.image}
                            />
                          </div>
                        )}
                        <div
                          className="text-right text-sm text-red-500 mt-2 hover:underline cursor-pointer"
                          onClick={() => handleReport({ rev })}
                        >
                          Report User
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 italic">
                No reviews yet.
              </p>
            )}
          </div>
        </section>

        <footer className="pt-8 text-center">
          <Button variant="subtle" color="gray">
            Back to top ↑
          </Button>
        </footer>
      </main>
    </div>
  );
}
