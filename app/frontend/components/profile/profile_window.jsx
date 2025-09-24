import { useState } from "react";

function ProfileWindow() {

  return (
    <div className=" w-full p-12 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex flex-row justify-center text-center space-x-6 align-middle">
        <img
          className="w-50 h-50 bg-gray-400 rounded-full"
          alt="profile picture"
        />
      </div>
      <div className="flex flex-col space-y-6">
        <div className=" space-x-6">
          <input className="input" type="text" placeholder="Enter display name..." value="Display Name"/>
          <button>Change display name</button>
        </div>
        <input className="input" type="text" value="Email" readOnly/>
        <p className=" mt-6 text-1xl">Acoount Created: "dateCreated"</p>
      </div>
    </div>
  );
}

export default ProfileWindow;
