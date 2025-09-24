import { useState } from "react";
import ReviewList from "./components/admin/reviews/review_list";
import Modal from "./components/Modal";
import ReviewWindow from "./components/admin/reviews/review_window";
import ReportList from "./components/admin/reports/report_list";
import ReportWindow from "./components/admin/reports/report_window";
import AccountList from "./components/admin/accounts/account_list";
import Add from "./components/admin/accounts/add_window";
import Edit from "./components/admin/accounts/edit_window";
import users from "./components/admin/user_test_data.json";

function AdminMenu() {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [role, setRole] = useState("");
  const [user, setUser] = useState();
  const [pageName, setPageName] = useState("Dashboard"); // Dyanmically change the page based on the button clicked.
  const [db, setDb] = useState(users);
  const [idCounter, setIdCounter] = useState(db.accounts.length + 1);


  function handleDeleteAccount(id) {
    setDb(db => ({...db,
    accounts: db.accounts.filter(acc => acc.id !== id),
    reviews: db.reviews.filter(r => r.id !== id),
    reports: db.reports.filter(r => r.id !== id)}));
  }
  function handleDeleteReport(id) {
    setDb(db => ({...db,
    reports: db.reports.filter(r => r.id !== id)}));
  }
  function handleDeleteReview(id) {
    setDb(db => ({...db,
    reviews: db.reviews.filter(r => r.id !== id),}));
  }

  function handleAddAccount(account) {
    account.id = idCounter;
    setIdCounter(idCounter + 1);
    setDb(db => ({...db,
    accounts: [...db.accounts, account]}));
  }
  

  return (
    <div className="flex flex-row" >
      <div className=" flex flex-col h-screen w-1/3 bg-gray-500 p-6">
        <h1 className="text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center">
          National Parks Information System
        </h1>
        <nav className=" flex flex-col mt-4 p-6 space-y-6">
          <button
            onClick={() => setPageName("Dashboard")}
            className="admin-nav"
          >
            Dashboard
          </button>
          <button onClick={() => setPageName("Reviews")} className="admin-nav">
            Reviews
          </button>
          <button onClick={() => setPageName("Reports")} className="admin-nav">
            Reports
          </button>
          <button onClick={() => setPageName("Accounts")} className="admin-nav">
            Accounts
          </button>
        </nav>
      </div>
      <section className=" flex flex-col justify-center h-screen w-screen p-12 space-y-24 ">
        <h1 className="text-4xl break-normal font-bold text-white text-shadow-lg text-shadow-black text-center mb-12">
          {pageName} {/* Placeholder for a header */}
        </h1>
        <div>
          {pageName !== "Dashboard" ? null : (
            <div className="flex flex-row space-x-4">
              <ReviewList setShowModal={setShowModal} sendUser={setUser} reviews={db.reviews} />
              <ReportList setShowModal={setShowModal2} sendUser={setUser} reports={db.reports} />
            </div>
          )}
          {pageName !== "Reviews" ? null : (
            <div className="max-w-full max-h-screen">
              <ReviewList setShowModal={setShowModal} sendUser={setUser} reviews={db.reviews} />
            </div>
          )}
          {pageName !== "Reports" ? null : (
            <div className="max-w-full max-h-screen">
              <ReportList setShowModal={setShowModal2} sendUser={setUser} reports={db.reports} />
            </div>
          )}
          {pageName !== "Accounts" ? null : (
            <div className="max-w-full max-h-screen">
              <AccountList
                setShowModalEdit={setShowModalEdit}
                setShowModalAdd={setShowModalAdd}
                setRole={setRole}
                sendUser={setUser}
                accounts={db.accounts}
              />
            </div>
          )}
        </div>
      </section>
      <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
        <ReviewWindow onClose={() => setShowModal(false)} user={user} onDeleteReview={handleDeleteReview} />
      </Modal>
      <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}>
        <ReportWindow onClose={() => setShowModal2(false)} user={user} onDeleteReport={handleDeleteReport} />
      </Modal>
      <Modal isVisible={showModalEdit} onClose={() => setShowModalEdit(false)}>
        <Edit onClose={() => setShowModalEdit(false)} account={user} onDeleteAccount={handleDeleteAccount} />
      </Modal>
      <Modal isVisible={showModalAdd} onClose={() => setShowModalAdd(false)}>
        <Add onClose={() => setShowModalAdd(false)} role={role} onAddAccount={handleAddAccount} setRole={setRole}/>
      </Modal>
    </div>
  );
}

export default AdminMenu;
