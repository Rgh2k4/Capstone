import React from 'react'

function SettingsMenu( {onRouteToLogin} ) {

    function handleChangeEmail() {
        
    }
    function handleChangePassword() {
        
    }
    function handleContact() {
        
    }
    function handleDelete() {
        onRouteToLogin();
    }


  return (
    <div className=' flex flex-col space-y-6 w-full'>
        <div>
            <h1>Settings</h1>
        </div>
        <div>
            <button onClick={handleChangeEmail}>Change Email</button>
        </div>
        <div>
            <button onClick={handleChangePassword}>Change Password</button>
        </div>
        <div>
            <button onClick={handleContact}>Contact Us</button>
        </div>
        <div>
            <button onClick={handleDelete}>Delete Account</button>
        </div>
    </div>
  )
}

export default SettingsMenu