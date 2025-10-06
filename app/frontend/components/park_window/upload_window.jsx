"use client";

import { useState } from "react";
import { auth, storage } from "../../../backend/databaseIntegration.jsx";
import { addData } from "../../../backend/database.jsx";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadWindow({ onClose }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const pickFile = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!title.trim()) return setErr("Please enter a title.");
    if (!file) return setErr("Please select an image.");
    const user = auth.currentUser;
    if (!user) return setErr("Please log in to upload.");

    try {
      setBusy(true);
      const path = `uploads/${user.uid}/${Date.now()}_${file.name}`;
      const r = ref(storage, path);
      await uploadBytes(r, file);
      const imageUrl = await getDownloadURL(r);

      await addData(user.uid, {
        title: title.trim(),
        description: desc.trim(),
        imageUrl,
        username: user.displayName || user.email || "Anonymous",
        date: new Date().toISOString(),
      });

      onClose?.();
    } catch (e) {
      setErr(e?.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="w-[920px] max-w-[92vw]">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold">Upload</h1>
      </header>

      <section className="rounded-2xl bg-[#d6dee6] p-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-6">
            <label
              htmlFor="image"
              className="cursor-pointer flex items-center justify-center h-64 rounded-2xl border border-gray-300 bg-white"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Selected"
                  className="h-full w-full object-cover rounded-2xl"
                />
              ) : (
                <div className="flex flex-col items-center text-black/80">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-14 w-14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12V4m0 0l-3 3m3-3l3 3"
                    />
                  </svg>
                  <span className="mt-3 font-semibold">Upload</span>
                  <span className="-mt-1">Image</span>
                </div>
              )}
              <input id="image" type="file" accept="image/*" onChange={pickFile} className="hidden" />
            </label>

            <div className="rounded-xl bg-[#e2e2e2] px-6 py-5 text-xl font-semibold">
              Ratings here
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <input
              className="h-14 w-full rounded-xl bg-white px-4 ring-1 ring-gray-300 outline-none shadow-sm focus:ring-2 focus:ring-sky-400"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              className="h-[360px] w-full resize-none rounded-xl bg-white px-4 py-3 ring-1 ring-gray-300 outline-none shadow-sm focus:ring-2 focus:ring-sky-400"
              placeholder="Description..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div className="flex items-center justify-end gap-4">
              {err && <span className="text-red-600 text-sm">{err}</span>}
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-[#a7d8ff] px-8 py-3 text-xl font-semibold shadow disabled:opacity-60"
              >
                {busy ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
