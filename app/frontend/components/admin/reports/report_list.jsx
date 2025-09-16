import ReportSubmissions from "./report_submissions";

function ReportList({ setShowModal, sendUser }) {
  const handleReport = (user) => {
    console.log("Data Recieved:");
    console.log(user);
    sendUser(user);
    setShowModal(true);
  };

  return (
    <section className=" bg-gray-100 drop-shadow-md drop-shadow-gray-400">
      <div className="flex justify-center text-4xl font-bold bg-gray-300 p-4 space-y-4 overflow-y-auto drop-shadow-sm drop-shadow-gray-400">
        <p>Reports</p>
      </div>
      <div className="rounded-b-lg p-4 overflow-y-auto">
        <ReportSubmissions handleReport={handleReport} />
      </div>
    </section>
  );
}

export default ReportList;
