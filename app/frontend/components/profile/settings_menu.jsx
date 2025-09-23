import React from 'react'

function SettingsMenu() {
  return (
    <div className=' flex flex-col space-y-6'>
        <div>
            <h1>Settings</h1>
        </div>
        <div>
            <button onClick={handleAdd}>Change Email</button>
        </div>
        <div>
            <button onClick={handleAdd}>Change Password</button>
        </div>
        <div>
            <button onClick={handleAdd}>Contact Us</button>
        </div>
        <div>
            <button onClick={handleAdd}>Delete Account</button>
        </div>
    </div>
  )
}

export default SettingsMenu