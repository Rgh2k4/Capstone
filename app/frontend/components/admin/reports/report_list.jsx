import ReportSubmissions from "./report_submissions";

function ReportList({ setShowModal, sendUser, reports, showHeader }) {

  const handleReport = (user) => {
    console.log("Data Recieved:");
    console.log(user);
    sendUser(user);
    setShowModal(true);
  };

  return (
    <div className="h-full flex flex-col">
      {showHeader && (
        <div className="bg-red-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 rounded-full p-2">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Pending Reports ({reports.length})</h2>
          </div>
        </div>
      )}
      <div className="flex-1 p-6 overflow-y-auto">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-lg">No pending reports</p>
          </div>
        ) : (
          <ReportSubmissions handleReport={handleReport} reports={reports}/>
        )}
      </div>
    </div>
  );
}

export default ReportList;
