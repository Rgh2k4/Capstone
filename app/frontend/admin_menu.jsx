import { useState } from "react";
import ReviewList from "./components/admin/reviews/review_list";
import Modal from "./components/Modal";
import ReviewWindow from "./components/admin/reviews/review_window";

function AdminMenu() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser ] = useState();
  const [pageName, setPageName] = useState("Dashboard")
  
  return (
    <div className="flex flex-row">
      <nav className=" flex flex-col h-screen w-1/3 bg-gray-500 p-6">
        <h1 className="text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
          National Parks Information System
        </h1>
        <div className=" flex flex-col mt-4 p-6 space-y-6">
          <button className="admin-nav">Dashboard</button>
          <button className="admin-nav">Reviews</button>
          <button className="admin-nav">Reports</button>
        </div>
      </nav>
      <section className=" flex flex-col justify-center h-screen w-screen p-12 space-y-24 ">
        <h1 className="text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
          {pageName}
        </h1>
        <div>
          <ReviewList setShowModal={setShowModal} sendUser={setUser}/>
        </div>
      </section>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}><ReviewWindow user={user}/></Modal>
    </div>
  );
}

export default AdminMenu;
