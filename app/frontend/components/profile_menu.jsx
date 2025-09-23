"use client";

import ProfileWindow from "./profile/profile_window";
import SettingsMenu from "./profile/settings_menu";

export default function ProfileMenu() {

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  

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
        <li onClick={() => setShowModal(true)} className="block rounded px-3 py-2 hover:bg-gray-100">Profile</li>
        <li onClick={() => setShowModal2 (true)} className="block rounded px-3 py-2 hover:bg-gray-100">Settings</li>
        <li onClick={() => setShowModal(true)} className="block rounded px-3 py-2 text-red-600 hover:bg-red-50">Logout</li>
        
      </ul>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <ProfileWindow />
      </Modal>
      <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}>
        <SettingsMenu />
      </Modal>
    </details>
  );
}
