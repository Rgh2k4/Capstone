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
import { AdminDeleteUser, approveReview, denyReview, GetUserData, isAdmin, LoadAdminList, loadPendingReviews, loadReports, LoadUserList, PromoteToAdmin, resolveReport } from "../backend/database";

function AdminMenu( { onRouteToLogin, onRouteToMainMenu } ) {
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to trigger re-fetching data
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
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
        alert("Access Denied. Redirecting to Main Menu.");
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
  }, [refreshTrigger]);
  
  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };


  function handleDeleteAccount(id) {
    AdminDeleteUser(id);
    triggerRefresh();
  }
  function handleReport(report, action) {
    resolveReport(report, action);
    triggerRefresh();
  }
  function handleReview(rev, action) {
    console.log("Handling review action:", action);
    console.log("Review Data:", rev);
    if (action === "approve") {
      approveReview({rev});
    } else if (action === "delete") {
      denyReview({rev});
    }
    triggerRefresh();
  }

  function handlePromoteToAdmin(accountUID) {
    console.log("Promoting account to admin:", accountUID);
    PromoteToAdmin(accountUID);
    triggerRefresh();
  }

  return (
  <div className="flex h-screen w-screen bg-gray-50">
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-center text-gray-800 leading-tight">
          National Parks Info System
        </h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {["Dashboard", "Reviews", "Reports", "Accounts"].map((page) => (
          <button
          key={page}
          onClick={() => setPageName(page)}
          className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all duration-200
            ${pageName === page
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"}
              `}
              >
            {page}
          </button>
        ))}
      </nav>
    </aside>

    {isAdmin && (
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{pageName}</h1>
            <div className="flex items-center space-x-4">
              {userData && (
                <>
                  <Button size='md' variant="outline" onClick={onRouteToMainMenu}>Main Menu</Button>
                  <ProfileMenu onRouteToLogin={onRouteToLogin} userData={userData}/>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto">
          {pageName === "Dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  mx-auto">
              <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Reviews</h2>
                  <Button size="sm" variant="subtle" onClick={() => setPageName("Reviews")}>View All</Button>
                </div>
                <div className="p-6">
                  <ReviewList
                    showHeader={false}
                    setShowModal={setShowModal}
                    sendUser={setAccount}
                    reviews={pendingReviews.slice(0, 5)}
                  />
                  {pendingReviews.length > 5 && (
                    <p className="text-gray-500 text-sm mt-4 text-center">
                      Showing 5 of {pendingReviews.length} pending reviews
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Reports</h2>
                  <Button size="sm" variant="subtle" onClick={() => setPageName("Reports")}>View All</Button>
                </div>
                <div className="p-6">
                  <ReportList
                    showHeader={false}
                    setShowModal={setShowModal2}
                    sendUser={setAccount}
                    reports={reports.slice(0, 5)}
                  />
                  {reports.length > 5 && (
                    <p className="text-gray-500 text-sm mt-4 text-center">
                      Showing 5 of {reports.length} pending reports
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {pageName === "Reviews" && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white shadow-lg rounded-xl border border-gray-200">
                <ReviewList
                  showHeader={true}
                  setShowModal={setShowModal}
                  sendUser={setAccount}
                  reviews={pendingReviews}
                />
              </div>
            </div>
          )}

          {pageName === "Reports" && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white shadow-lg rounded-xl border border-gray-200">
                <ReportList
                  setShowModal={setShowModal2}
                  sendUser={setAccount}
                  reports={reports}
                  showHeader={true}
                />
              </div>
            </div>
          )}

          {pageName === "Accounts" && (
            <div className=" mx-auto">
              <div className="bg-white shadow-lg rounded-xl border border-gray-200">
                <AccountList
                  setShowModalEdit={setShowModalEdit}
                  setShowModalAdd={setShowModalAdd}
                  sendUser={setAccount}
                  users={users}
                  admins={admins}
                />
              </div>
            </div>
          )}
        </div>
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
        users={users}
        onPromoteAccount={handlePromoteToAdmin}
      />
    </Modal>
  </div>
  );
}

export default AdminMenu;
