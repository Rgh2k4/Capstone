"use client";

import { useEffect, useState } from "react";
import { setupUploadEvents } from "../../../backend/upload(OLD).jsx";
import { auth, storage } from "../../../backend/databaseIntegration.jsx";
import { ref, uploadBytes } from "firebase/storage";
import { uploadImage } from "@/app/backend/UploadStorage.jsx";
import { Button, Input, Textarea } from "@mantine/core";

export default function Upload_Window({ onClose }) {
  const [submited, setSubmitted] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.firebase = { auth: () => ({ currentUser: auth.currentUser }) };
    window.storage = {
      ref: (path) => ({
        put: (file, meta) => uploadBytes(ref(storage, path), file, meta),
      }),
    };
    setupUploadEvents();
  }, []);

  function handleImageFile(e) {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
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
        <div id="upload-container" className="grid grid-cols-2 gap-10 my-12">
          <div className="flex flex-col gap-6">
            <label
              htmlFor="upload-file"
              className="flex h-50 cursor-pointer items-center justify-center rounded-2xl border border-gray-300 bg-white"
            >
              <img
                id="file-preview"
                alt="Preview"
                className="hidden h-full w-full rounded-2xl object-cover"
              />
              <span
                id="file-label-text"
                className="text-center font-semibold text-black/80"
              >
                Upload
                <br />
                Image
              </span>
            </label>
            <input
              id="upload-file"
              type="file"
              accept="image/*"
              className="hidden"
            />
            <div className="rounded-xl bg-[#e2e2e2] px-6 py-5 text-xl font-semibold">
              Ratings here
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Input.Wrapper className="w-full" size="md" label="Title">
              <Input
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
          <input type="file" onChange={handleImageFile} />
          <Button
            size="lg"
            variant="filled"
            loading={submited}
            id="upload-button"
            className="rounded-xl bg-[#a7d8ff] px-8 py-3 text-xl font-semibold shadow"
          >
            Submit
          </Button>
        </div>
      </section>
    </main>
  );
}
