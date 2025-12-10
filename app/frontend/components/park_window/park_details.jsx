"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { database, auth } from "../../../backend/databaseIntegration";
import { ActionIcon, Button, Select, Divider } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { PullImage, PullProfileImageReview } from "@/app/backend/uploadStorage";
import { readReviewData, ReportUser } from "@/app/backend/database";
import { DirectionsRenderer } from "@react-google-maps/api";
import ReviewSection from "./review_section";

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
    if (!user) return toast("You must be logged in to favorite a park.");
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
        className={`transition-transform ${isFavorite ? "text-red-500 scale-110" : "text-gray-400 hover:text-red-400"
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
    if (!user) return toast.error("You must be logged in to report a user.");
    ReportUser(
      {
        reportedUserID: rev.reviewData.uid,
        reporterUserID: user.uid,
        reason: "Inappropriate content",
      },
      { rev }
    );
    toast.success(`${rev.displayName || "Anonymous"} has been reported.`);
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
    <div className="overflow-hidden">
      <div className="relative h-80 bg-gradient-to-r from-green-600 to-blue-600">
        <img
          src="https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg"
          alt="Park"
          className="object-cover w-full h-full opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold mb-2">{park.name}</h1>
              <p className="text-lg text-green-100">Explore the natural beauty</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-full p-2">
              <FavoriteButton />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 rounded-full p-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">About This Park</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            {park.description || "Discover the natural wonders and unique features that make this park a special destination for visitors from around the world."}
          </p>
        </div>

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
              onClick={() => {
                if (!routePois || routePois.length === 0) {
                  return toast.error(
                    "You must start a route first before adding another location."
                  )
                }
                else addToRoute(park)
              }
              }
            >
              Add to Route
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Select
                label="Travel Mode"
                value={travelMode}
                onChange={(value) => setTravelMode(value)}
                size="md"
                data={[
                  { value: "DRIVING", label: "Driving" },
                  { value: "WALKING", label: "Walking" },
                  { value: "BICYCLING", label: "Bicycling" },
                  { value: "TRANSIT", label: "Public Transit" },
                ]}
              />
            </div>
            <div className="flex items-end space-x-3">
              <Button
                size="md"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan", deg: 60 }}
                onClick={handleRouteClick}
                className="flex-1"
                leftSection={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                }
              >
                Get Directions
              </Button>
              <Button
                size="md"
                variant="gradient"
                gradient={{ from: "green", to: "teal", deg: 60 }}
                onClick={() => {
                  if (!routePois || routePois.length === 0) {
                    return alert("You must start a route first before adding another location.")
                  }
                  else addToRoute(park)
                }}
                leftSection={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
              >
                Add to Route
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 rounded-full p-2">
                  <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Visitor Reviews</h2>
              </div>
              <Button
                size="md"
                variant="gradient"
                gradient={{ from: "orange", to: "red", deg: 90 }}
                onClick={openButtonUpload}
                leftSection={
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                }
              >
                Write Review
              </Button>
            </div>
          </div>

          <div className="p-6 max-h-96 overflow-y-auto">
            {reviews?.length > 0 ? (
              <ReviewSection handleReport={handleReport} park={park} reviews={reviews} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="bg-gray-50 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <p className="text-lg font-medium mb-2">No reviews yet</p>
                <p className="text-sm">Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
