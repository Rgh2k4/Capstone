"use client";

export default function ProfileMenu() {
  return (
    <details className="relative">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <img
          src="/window.svg"
          alt="Profile"
          className="h-12 w-12 rounded-full bg-gray-300 object-cover"
        />
      </summary>

      <ul className="absolute right-0 z-50 mt-2 w-44 rounded-md bg-white p-1 shadow ring-1 ring-black/5">
        <li><a href="/profile"  className="block rounded px-3 py-2 hover:bg-gray-100">Profile</a></li>
        <li><a href="/settings" className="block rounded px-3 py-2 hover:bg-gray-100">Settings</a></li>
        <li><div className="my-1 h-px bg-gray-200" /></li>
        <li><a href="/logout"   className="block rounded px-3 py-2 text-red-600 hover:bg-red-50">Logout</a></li>
      </ul>
    </details>
  );
}
