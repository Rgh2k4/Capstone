import { useState } from "react";
import ReviewList from "./components/admin/reviews/review_list";
import Modal from "./components/Modal";
import ReviewWindow from "./components/admin/reviews/review_window";
import ReportList from "./components/admin/reports/report_list";
import ReportWindow from "./components/admin/reports/report_window";
import AccountList from "./components/admin/accounts/account_list";
import Add from "./components/admin/accounts/add_window";
import Edit from "./components/admin/accounts/edit_window";

function AdminMenu() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [role, setRole] = useState("");
  const [user, setUser ] = useState();
  const [pageName, setPageName] = useState("Dashboard"); // Dyanmically change the page based on the button clicked.
  
  return (
    <div className="flex flex-row">
      <div className=" flex flex-col h-screen w-1/3 bg-gray-500 p-6">
        <h1 className="text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
          National Parks Information System
        </h1>
        <nav className=" flex flex-col mt-4 p-6 space-y-6">
          <button onClick={() => setPageName("Dashboard")} className="admin-nav">Dashboard</button>
          <button onClick={() => setPageName("Reviews")} className="admin-nav">Reviews</button>
          <button onClick={() => setPageName("Reports")} className="admin-nav">Reports</button>
          <button onClick={() => setPageName("Accounts")} className="admin-nav">Accounts</button>
        </nav>
      </div>
      <section className=" flex flex-col justify-center h-screen w-screen p-12 space-y-24 ">
        <h1 className="text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center mb-12">
          {pageName} {/* Placeholder for a header */}
        </h1>
        <div>
          {pageName !== "Dashboard" ? null : (
            <div className="flex flex-row space-x-4">
              <ReviewList setShowModal={setShowModal} sendUser={setUser}/>
              <ReportList setShowModal={setShowModal2} sendUser={setUser}/>
            </div>
          )}
          {pageName !== "Reviews" ? null : (
            <div className="max-w-full max-h-screen">
              <ReviewList setShowModal={setShowModal} sendUser={setUser}/>
            </div>
          )}
          {pageName !== "Reports" ? null : (
            <div className="max-w-full max-h-screen">
              <ReportList setShowModal={setShowModal2} sendUser={setUser}/>
            </div>
          )}
          {pageName !== "Accounts" ? null : (
            <div className="max-w-full max-h-screen">
              <AccountList setShowModalEdit={setShowModalEdit} setShowModalAdd={setShowModalAdd} setRole={setRole} sendUser={setUser}/>
            </div>
          )}
          
        </div>
      </section>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}><ReviewWindow onClose={() => setShowModal(false)} user={user}/></Modal>
      <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}><ReportWindow onClose={() => setShowModal2(false)} user={user}/></Modal>
      <Modal isVisible={showModalEdit} onClose={() => setShowModalEdit(false)}><Edit onClose={() => setShowModalEdit(false)} account={user}/></Modal>
      <Modal isVisible={showModalAdd} onClose={() => setShowModalAdd(false)}><Add onClose={() => setShowModalAdd(false)} role={role}/></Modal>
    </div>
  );
}

export default AdminMenu;
