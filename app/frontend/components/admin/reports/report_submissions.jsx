import users from "../user_test_data.json";

function ReportSubmissions({ handleReport }) {
  let reports = users.reports;

  function handleData({ rep }) {
    console.log("Data:");
    console.log(rep);

    handleReport(rep);
  }
  return (
    <ul>
      {reports.map((rep, index) => (
        <div key={index} className="border-b-4 border-gray-300">
          <div className="grid grid-cols-3 gap-4 m-4">
            <p className=" mt-6 mr-8 font-semibold text-2xl">{rep.username}</p>
            <p className=" mt-6 mr-8 text-1xl">Submited: {rep.date}</p>
            <button onClick={() => handleData({ rep })}>Review</button>
          </div>
        </div>
      ))}
    </ul>
  );
}

export default ReportSubmissions;
