import { Button } from "@mantine/core";

function ReportSubmissions({ handleReport, reports }) {
  function handleData({ rep }) {
    console.log("Data:");
    console.log(rep);

    handleReport(rep);
  }
  return (
    <div className="space-y-4">
      {reports.map((rep, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 rounded-full p-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Reported User</p>
                <p className="text-sm text-gray-500">{rep.reportedUserID ? rep.reportedUserID.slice(0,7) + "...": "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 rounded-full p-2">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Reason</p>
                <p className="text-sm font-medium text-orange-600">{rep.reason}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Submitted</p>
                <p className="text-sm text-gray-500">{rep.dateReported ? new Date(rep.dateReported.seconds * 1000).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="md"
                variant="filled"
                color="red"
                className="hover:bg-red-700 transition-colors duration-200"
                onClick={() => handleData({ rep })}
              >
                Review
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ReportSubmissions;
