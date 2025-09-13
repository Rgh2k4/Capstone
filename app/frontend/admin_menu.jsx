import Reviews from './components/admin/review_list'

function AdminMenu() {
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
            <Reviews/>
          </div>

        </section>
    </div>
  )
}

export default AdminMenu