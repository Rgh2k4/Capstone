import React from 'react'

function SettingsMenu( {onRouteToLogin, onChangeCredential} ) {

    function handleChangeEmail() {
        onChangeCredential('email');
    }
    function handleChangePassword() {
        onChangeCredential('password');
    }
    function handleContact() {
        
    }
    function handleDelete() {
        onRouteToLogin();
    }


  return (
    <div className=' flex flex-col justify-center items-center space-y-6 p-32'>
        <div className=' mb-12'>
            <h1 className=' text-5xl font-bold'>Settings</h1>
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