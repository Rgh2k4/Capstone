import { useEffect, useState } from "react";
import ReviewList from "./components/admin/reviews/review_list";
import Modal from "./components/Modal";
import ReviewWindow from "./components/admin/reviews/review_window";
import ReportList from "./components/admin/reports/report_list";
import ReportWindow from "./components/admin/reports/report_window";
import AccountList from "./components/admin/accounts/account_list";
import Add from "./components/admin/accounts/add_window";
import Edit from "./components/admin/accounts/edit_window";
import testUsers from "./components/admin/user_test_data.json";
import { Button } from "@mantine/core";
import { auth } from "../backend/databaseIntegration.jsx";
import ProfileMenu from "./components/profile/profile_menu";
import { GetUserData, LoadAdminList, LoadUserList } from "../backend/database";

function AdminMenu( { onRouteToLogin, onRouteToMainMenu } ) {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [role, setRole] = useState("");
  const [account, setAccount] = useState();
  const [pageName, setPageName] = useState("Dashboard"); // Dyanmically change the page based on the button clicked.
  const [db, setDb] = useState(testUsers);
  const [idCounter, setIdCounter] = useState(db.accounts.length + 1);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  const [isAdmin, setIsAdmin] = useState(false)
  const user = auth.currentUser;
  const userData = GetUserData(user.email).then(userData => {
    if (userData.role === "Admin") {
      setIsAdmin(true)
    } else {
      onRouteToMainMenu();
    }
  });


  useEffect(() => {
    const userList = LoadUserList().then(userList => {
      console.log("User List:", userList);
      setUsers(userList)
    });
    const adminList = LoadAdminList().then(adminList => {
      console.log("Admin List:", adminList);
      setAdmins(adminList)
    });
    
  
  }, [])
  

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
  <div className="flex h-screen w-screen">
    <aside className="w-1/8 bg-white shadow-md shadow-gray-600 text-black flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-8 text-center">
        National Parks Info System
      </h1>
      <nav className="flex flex-col space-y-3">
        {["Dashboard", "Reviews", "Reports", "Accounts"].map((page) => (
          <button
          key={page}
          onClick={() => setPageName(page)}
          className={`px-4 py-2 rounded-lg text-left font-medium transition-colors
            ${pageName === page
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-700 hover:text-blue-400"}
              `}
              >
            {page}
          </button>
        ))}
      </nav>
    </aside>

    {isAdmin && (
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="grid grid-cols-2 mb-20">
          <h1 className="text-4xl font-bold text-gray-800">{pageName}</h1>
          <div className=" flex flex-row justify-end space-x-8">
            {user && <Button size='lg' onClick={onRouteToMainMenu}>Main Menu</Button>}
            <ProfileMenu onRouteToLogin={onRouteToLogin} userData={userData}/>
          </div>
        </div>
        {pageName === "Dashboard" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6">
              <div className=" flex flex-row justify-between">
                <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
                <Button on onClick={() => setPageName("Reviews")}>View More</Button>
              </div>
              <ReviewList
                setShowModal={setShowModal}
                sendUser={setAccount}
                reviews={db.reviews}
              />
            </div>
            <div className="bg-white shadow-md rounded-xl p-6">
              <div className=" flex flex-row justify-between">
                <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
                <Button on onClick={() => setPageName("Reports")}>View More</Button>
              </div>
              <ReportList
                setShowModal={setShowModal2}
                sendUser={setAccount}
                reports={db.reports}
              />
            </div>
          </div>
        )}

        {pageName === "Reviews" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <ReviewList
              setShowModal={setShowModal}
              sendUser={setAccount}
              reviews={db.reviews}
            />
          </div>
        )}

        {pageName === "Reports" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <ReportList
              setShowModal={setShowModal2}
              sendUser={setAccount}
              reports={db.reports}
            />
          </div>
        )}

        {pageName === "Accounts" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <AccountList
              setShowModalEdit={setShowModalEdit}
              setShowModalAdd={setShowModalAdd}
              setRole={setRole}
              sendUser={setAccount}
              users={users}
              admins={admins}
            />
          </div>
        )}
      </main>
    )}

    <Modal isVisible={showModal} onClose={() => setShowModal(false)}>
      <ReviewWindow
        onClose={() => setShowModal(false)}
        user={account}
        onDeleteReview={handleDeleteReview}
      />
    </Modal>

    <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}>
      <ReportWindow
        onClose={() => setShowModal2(false)}
        user={account}
        onDeleteReport={handleDeleteReport}
      />
    </Modal>

    <Modal isVisible={showModalEdit} onClose={() => setShowModalEdit(false)}>
      <Edit
        onClose={() => setShowModalEdit(false)}
        account={account}
        onDeleteAccount={handleDeleteAccount}
      />
    </Modal>

    <Modal isVisible={showModalAdd} onClose={() => setShowModalAdd(false)}>
      <Add
        onClose={() => setShowModalAdd(false)}
        role={role}
        onAddAccount={handleAddAccount}
        setRole={setRole}
      />
    </Modal>
  </div>
  );
}

export default AdminMenu;
