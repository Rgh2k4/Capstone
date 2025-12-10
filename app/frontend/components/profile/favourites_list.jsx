import { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { auth } from "@/app/backend/databaseIntegration";
import { loadUserFavorites, removeFavoritePark } from "@/app/backend/database";

function FavouritesList({ userData, viewParkDetails }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  function onViewPark(park) {
    viewParkDetails(park);
  }

  async function handleRemoveFavorite(park) {
    const user = auth.currentUser;
    if (!user) return;

    const success = await removeFavoritePark(user.uid, park.id);
    if (success) {
      setFavourites(prev => prev.filter(fav => fav.id !== park.id));
    } else {
      alert("Failed to remove favorite. Please try again.");
    }
  }

  async function loadFavorites() {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userFavorites = await loadUserFavorites(user.uid);
      setFavourites(userFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, [userData]);

  return (
    <div className="overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Favourite Parks</h2>
          <p className="text-green-100">Your saved national parks and locations</p>
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading your favourites...</p>
          </div>
        ) : favourites.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-lg mb-2">No favourite parks yet</p>
            <p className="text-sm">Start exploring and save your favourite national parks!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favourites.map((park, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{park.Name_e}</h3>
                  <button 
                    className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    onClick={() => handleRemoveFavorite(park)}
                    title="Remove from favorites"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Coordinates: {park.lat?.toFixed(4)}, {park.lng?.toFixed(4)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {/* <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => onViewPark(park)}
                  >
                    View Details
                  </Button>
                  */}
                  <Button 
                    size="sm" 
                    variant="light" 
                    color="red"
                    onClick={() => handleRemoveFavorite(park)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavouritesList;