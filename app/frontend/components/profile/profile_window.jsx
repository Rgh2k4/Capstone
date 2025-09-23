import { useState } from "react";

function ProfileWindow() {

  return (
    <div className=" p-12 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex flex-row justify-center text-center">
        <img
          className="w-50 h-50 bg-gray-400 rounded-full"
          alt="profile picture"
        />
        <label
          value="username"
          className="input"
        />
      </div>
      <div className="flex flex-col space-y-6">
        <label
          value="email"
          className="input"
        />
        <p className=" mt-6 text-1xl">Acoount Created: "dateCreated"</p>
      </div>
    </div>
  );
}

export default ProfileWindow;
