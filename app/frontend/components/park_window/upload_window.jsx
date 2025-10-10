"use client";

import { useEffect } from "react";
import { setupUploadEvents } from "../../../backend/upload(OLD).jsx";
import { auth, storage } from "../../../backend/databaseIntegration.jsx";
import { ref, uploadBytes } from "firebase/storage";
import { uploadImage } from "@/app/backend/UploadStorage.jsx";

export default function Upload_Window() {
  useEffect(() => {
    window.firebase = { auth: () => ({ currentUser: auth.currentUser }) };
    window.storage = { ref: (path) => ({ put: (file, meta) => uploadBytes(ref(storage, path), file, meta) }) };
    setupUploadEvents();
  }, []);

  function handleImageFile(e) {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  }

  return (
    <main className="w-[920px] max-w-[92vw]">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl font-extrabold">Upload</h1>
        <button id="close-upload" aria-label="Close">✕</button>
      </header>

      <section id="upload-sidebar" className="rounded-2xl bg-[#d6dee6] p-8 transition-transform">
        <div id="upload-container" className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-6">
            <label htmlFor="upload-file" className="flex h-64 cursor-pointer items-center justify-center rounded-2xl border border-gray-300 bg-white">
              <img id="file-preview" alt="Preview" className="hidden h-full w-full rounded-2xl object-cover" />
              <span id="file-label-text" className="text-center font-semibold text-black/80">Upload<br />Image</span>
            </label>
            <input id="upload-file" type="file" accept="image/*" className="hidden" />
            <div className="rounded-xl bg-[#e2e2e2] px-6 py-5 text-xl font-semibold">Ratings here</div>
          </div>

          <div className="flex flex-col gap-6">
            <input
              id="photo-location"
              type="text"
              placeholder="Title..."
              className="h-14 w-full rounded-xl bg-white px-4 ring-1 ring-gray-300 outline-none shadow-sm focus:ring-2 focus:ring-sky-400"
            />
            <textarea
              placeholder="Description..."
              className="h-[360px] w-full resize-none rounded-xl bg-white px-4 py-3 ring-1 ring-gray-300 outline-none shadow-sm focus:ring-2 focus:ring-sky-400"
            />
            <div className="flex items-center justify-end gap-3">
              <button id="cancel-upload" className="rounded-xl border px-6 py-3">Cancel</button>
              <input type="file" onChange={handleImageFile} />
              <button id="upload-button" className="rounded-xl bg-[#a7d8ff] px-8 py-3 text-xl font-semibold shadow">Submit</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
