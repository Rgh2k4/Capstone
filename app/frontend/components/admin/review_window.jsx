import React from 'react'

function ReviewWindow({user}) {
  return (
    <div className=' bg-amber-700'>
        <div>
            <img alt='profile picture'/>
            <p>{user.username}</p>
        </div>
        <div>
            <p>{user.description}</p>
        </div>
        <div>
            <button className=' p-6 bg-white rounded-md'>Delete</button>
            <button className=' p-6 bg-white rounded-md'>Approve</button>
        </div>
    </div>
    
  )
}

export default ReviewWindow