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
import { approveReview, denyReview, GetUserData, isAdmin, LoadAdminList, loadPendingReviews, loadReports, LoadUserList, resolveReport } from "../backend/database";

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
  const [pendingReviews, setPendingReviews] = useState([]);
  const [reports, setReports] = useState([]);
  


  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  function setupUser() {
    //console.log("Current user:", user);
    GetUserData(user.uid).then((data) => {
      //console.log("User Data:", data);
      console.log("Is Admin:", data.role === "Admin");
      if (data.role === "Admin") {
        setIsAdmin(true);
      } else {
        toast.error("Access Denied. Redirecting to Main Menu.");
        onRouteToMainMenu();
      }
      setUserData(data);
    });
  }


  useEffect(() => {
    setupUser();

    const reportList = loadReports().then(reportList => {
      console.log("Pending Reports:", reportList);
      setReports(reportList)
    });
    const reviewList = loadPendingReviews().then(reviewList => {
      console.log("Pending Reviews:", reviewList);
      setPendingReviews(reviewList)
    });
    const userList = LoadUserList().then(userList => {
      console.log("User List:", userList);
      setUsers(userList)
    });
    const adminList = LoadAdminList().then(adminList => {
      console.log("Admin List:", adminList);
      setAdmins(adminList)
    });
  }, [resolveReport, approveReview, denyReview]);
  

  function handleDeleteAccount(id) {
    setDb(db => ({...db,
    accounts: db.accounts.filter(acc => acc.id !== id),
    reviews: db.reviews.filter(r => r.id !== id),
    reports: db.reports.filter(r => r.id !== id)}));
  }
  function handleReport(report, action) {
    resolveReport(report, action);
  }
  function handleReview(rev, action) {
    console.log("Handling review action:", action);
    console.log("Review Data:", rev);
    if (action === "approve") {
      approveReview({rev});
    } else if (action === "delete") {
      denyReview({rev});
    }
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
            {userData && (
              <>
                <Button size='lg' onClick={onRouteToMainMenu}>Main Menu</Button>
                <ProfileMenu onRouteToLogin={onRouteToLogin} userData={userData}/>
              </>
            )}
          </div>
        </div>
        {pageName === "Dashboard" && (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white shadow-md rounded-xl p-6">
              <div className=" flex flex-row justify-between">
                <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
                <Button onClick={() => setPageName("Reviews")}>View More</Button>
              </div>
              <ReviewList
                showHeader={false}
                setShowModal={setShowModal}
                sendUser={setAccount}
                reviews={pendingReviews}
              />
            </div>
            <div className="bg-white shadow-md rounded-xl p-6">
              <div className=" flex flex-row justify-between">
                <h2 className="text-xl font-semibold mb-4">Recent Reports</h2>
                <Button onClick={() => setPageName("Reports")}>View More</Button>
              </div>
              <ReportList
                showHeader={false}
                setShowModal={setShowModal2}
                sendUser={setAccount}
                reports={reports}
              />
            </div>
          </div>
        )}

        {pageName === "Reviews" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <ReviewList
              showHeader={true}
              setShowModal={setShowModal}
              sendUser={setAccount}
              reviews={pendingReviews}
            />
          </div>
        )}

        {pageName === "Reports" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <ReportList
              setShowModal={setShowModal2}
              sendUser={setAccount}
              reports={reports}
              showHeader={true}
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
        onHandleReview={handleReview}
      />
    </Modal>

    <Modal isVisible={showModal2} onClose={() => setShowModal2(false)}>
      <ReportWindow
        onClose={() => setShowModal2(false)}
        user={account}
        onHandleReport={handleReport}
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
