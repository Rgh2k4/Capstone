"use client";

import { useState } from "react";
import { uploadImage } from "@/app/backend/uploadStorage.jsx";
import { Button, Input, Textarea, TextInput } from "@mantine/core";
import { auth, database } from "@/app/backend/databaseIntegration";
import { addReview } from "@/app/backend/database";
import { getDoc, doc } from "firebase/firestore";

export default function Upload_Window({ onClose, parkInfo }) {
  const [submited, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const park = parkInfo ? parkInfo : null;
  const user = auth.currentUser;

  async function handleSubmit(e) {
    setSubmitted(true);
    e.preventDefault();
    const userData = await getDoc(doc(database, "users", user.uid));
    const location = park.name.split(' ').join('');

    try {
      let imgURL;
      try {
        imgURL = image.name;
        console.log("Image URL:", imgURL);
      } catch (error) {
        imgURL = null;
        console.log("No image uploaded.");
      }

      if (park != null) {
        addReview({uid: user.uid, title: title, message: message, rating: rating, location_name: park.name, image: imgURL})
      }
      if (image != null) {
        uploadImage(image, location);
      }
      toast.success("Review Submitted!");
      onClose();
    } catch (error) {
      alert("Failed to submit review. Please try again.");
      console.error("Error uploading review:", error);
      setSubmitted(false);
      return;
    }
  }

  function previewImage(e) {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const img = URL.createObjectURL(file);
      setPreview(img);
    }
  }

  function handleRating(e) {
    const rateInput = e.currentTarget.value;

    if (rateInput === '' || /^\d+$/.test(rateInput)) {

      const intRate = parseInt(rateInput);
      if (intRate > 0 || intRate < 11) {
        setRating(intRate);
      }    
    }
  }

  return (
    <div className="overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Share Your Experience</h2>
          <p className="text-green-100">Tell others about your visit to {park?.name || "this park"}</p>
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900">Photo (Optional)</label>
                <div className="flex flex-col space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors duration-200 bg-gray-50">
                    {preview ? (
                      <div className="relative">
                        <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg shadow-md" />
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                          <p className="text-white font-medium">Click to change image</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-lg font-medium text-gray-600 mb-2">Upload a photo</p>
                        <p className="text-sm text-gray-500">Share a beautiful moment from your visit</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    onChange={previewImage}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <label className="block text-lg font-semibold text-gray-900 mb-4">
                  Rating (1-10)
                </label>
                <Input
                  size="lg"
                  placeholder="Rate your experience (1-10)"
                  value={rating}
                  onChange={handleRating}
                  type="number"
                  min="1"
                  max="10"
                  leftSection={
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  }
                />
              </div>
            </div>

            <div className="space-y-6">
              <Input.Wrapper size="lg" label="Review Title" required>
                <Input
                  disabled={submited}
                  size="lg"
                  placeholder="Give your review a catchy title..."
                  value={title}
                  onChange={(event) => setTitle(event.currentTarget.value)}
                  leftSection={
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  }
                />
              </Input.Wrapper>

              <Textarea
                label="Your Review"
                description="Share details about your visit, what you enjoyed, and any tips for future visitors"
                placeholder="Tell us about your experience at this park..."
                minRows={8}
                maxRows={12}
                required
                value={message}
                onChange={(event) => setMessage(event.currentTarget.value)}
                className="text-lg"
              />

              {park && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Reviewing</p>
                      <p className="text-lg font-semibold text-blue-800">{park.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              <Button
                size="lg"
                variant="outline"
                onClick={onClose}
                disabled={submited}
              >
                Cancel
              </Button>
              <Button
                size="lg"
                variant="filled"
                loading={submited}
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition-colors duration-200"
                leftSection={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                }
              >
                Submit Review
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
