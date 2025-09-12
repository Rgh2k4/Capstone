/*

Start of component{

    view button function (pending content) {
        opens window of the full details of the content
        has two buttons: "approve" and "reject"

        "approve" marks content as visible.
    }

    return(

        view box

        box of pending user content with a button to view it and activates function

        box of items

    )
}

*/


import React from 'react'

function Dashboard() {
  return (
    <div className='flex flex-row'>
        <section className=' flex flex-col h-screen w-1/3 bg-gray-500 p-6'>
          <div className='  mt-14 p-6 space-y-6'>
            <button className=' p-6 bg-white rounded-md'>Dashboard</button>
            <button className=' p-6 bg-white rounded-md'>Reviews</button>
            <button className=' p-6 bg-white rounded-md'>Reports</button>
          </div>
        </section>
        <section className=' flex flex-col justify-center h-screen w-screen p-12'>
          <h1>Dashboard</h1>
          <div>

          </div>

        </section>
    </div>
  )
}

export default Dashboard