"use client";

export default function EditAccount() {
  return (
    <div className="min-h-screen p-6">
      <button
        aria-label="Close"
        className="fixed right-6 top-6 grid h-10 w-10 place-items-center rounded-md bg-white shadow ring-1 ring-black/10"
      >
        ✕
      </button>

      <div className="mx-auto mt-10 max-w-2xl space-y-8">
        <div className="mx-auto grid place-items-center gap-6">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-black">
            <svg viewBox="0 0 24 24" className="h-12 w-12 text-sky-200" fill="currentColor">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.239-8 5v1h16v-1c0-2.761-3.58-5-8-5z" />
            </svg>
          </div>
          <div className="h-6 w-72 rounded bg-sky-300" />
        </div>

        <div className="mx-auto max-w-xl space-y-6">
          <input
            placeholder="Username..."
            className="w-full rounded-xl border px-4 py-3 shadow-sm"
          />
          <input
            type="email"
            placeholder="Email..."
            className="w-full rounded-xl border px-4 py-3 shadow-sm"
          />
          <input
            type="password"
            placeholder="Password..."
            className="w-full rounded-xl border px-4 py-3 shadow-sm"
          />

          <div className="mt-8 grid grid-cols-2 gap-8">
            <button className="rounded-2xl bg-gray-300 px-6 py-4 text-2xl font-semibold shadow-md hover:bg-gray-200">
              Delete
            </button>
            <button className="rounded-2xl bg-gray-300 px-6 py-4 text-2xl font-semibold shadow-md hover:bg-gray-200">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
