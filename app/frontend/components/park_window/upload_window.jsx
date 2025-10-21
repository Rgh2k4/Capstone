"use client";

import { useState } from "react";
import { uploadImage } from "@/app/backend/UploadStorage.jsx";
import { Button, Input, Textarea, TextInput } from "@mantine/core";
import { auth } from "@/app/backend/databaseIntegration";
import { addReview } from "@/app/backend/database";

export default function Upload_Window({ onClose, parkInfo }) {
  const [submited, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState("");
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const park = parkInfo ? parkInfo : null;
  const user = auth.currentUser;

  function handleSubmit(e) {
    e.preventDefault();
    const location = park.name.split(' ').join('');
    addReview(user.uid, {title: title, message: message, rating: rating}, location)
    if (image && park != null) {
      //uploadImage(image, location);    
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
    <main className="flex flex-col justify-center items-center space-y-8 p-8">
      <header className="mb-6 flex items-center">
        <h1 className="text-4xl font-extrabold">Upload</h1>
      </header>

      <section
        id="upload-sidebar"
        className="rounded-2xl p-8 drop-shadow-sm bg-white transition-transform"
      >
        <form onSubmit={handleSubmit}>
          <div id="upload-container" className="grid grid-cols-2 gap-10 my-12">
            <div className="flex flex-col gap-6">
              {preview && (
                <img src={preview} alt="Image" className="w-100" />
              )}
              <input type="file" name="image" accept="image/*" onChange={previewImage} className="border-2" />
              <div className="rounded-xl bg-[#e2e2e2] px-6 py-5 text-xl font-semibold">
                <TextInput 
                  size="md"
                  placeholder="Rating Here"
                  value={rating}
                  onChange={handleRating}
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <Input.Wrapper className="w-full" size="md" label="Title">
                <TextInput
                  disabled={submited}
                  size="md"
                  placeholder="Enter title..."
                  value={title}
                  onChange={(event) => setTitle(event.currentTarget.value)}
                />
              </Input.Wrapper>
                <Textarea
                  label="Message"
                  description="Share your experience with this park!"
                  placeholder="Type your message here..."
                  minRows={6}
                  value={message}
                  onChange={(event) => setMessage(event.currentTarget.value)}
                />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button
              size="lg"
              variant="filled"
              loading={submited}
              type="submit"
              className="rounded-xl bg-[#a7d8ff] px-8 py-3 text-xl font-semibold shadow"
            >
              Submit
            </Button>
          </div>
        </form>
        
      </section>
    </main>
  );
}
