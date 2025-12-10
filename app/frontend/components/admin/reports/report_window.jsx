import { PullImage } from "@/app/backend/uploadStorage";
import { Button, Badge, Divider } from "@mantine/core";

function ReportWindow({ user: report, onClose, onHandleReport }) {
  function handleDelete() {
    onClose();
    onHandleReport(report, "delete");
    toast.success("Report Deleted!");
  }

  function handleApprove() {
    onClose();
    onHandleReport(report, "approve");
  }

  const getReasonColor = (reason) => {
    switch (reason?.toLowerCase()) {
      case "spam":
        return "orange";
      case "inappropriate":
      case "harassment":
        return "red";
      case "fake":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <div className="  shadow-2xl rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Report Review</h2>
          <p className="text-red-100">
            Review and take action on this user report
          </p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reported User
              </h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">
                {report.reportedUserID || "N/A"}
              </p>
              <Badge
                color={getReasonColor(report.reason)}
                variant="light"
                size="lg"
              >
                {report.reason || "Not specified"}
              </Badge>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-100 rounded-full p-2">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Reporter</h3>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700 font-medium">
                {report.reporterUserID || "Anonymous"}
              </p>
              <p className="text-sm text-gray-500">
                Reported:{" "}
                {report.dateReported
                  ? new Date(report.dateReported.seconds * 1000).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {report.reviewData && (
          <div className="space-y-6">
            <Divider label="Reported Content" labelPosition="center" />

            <div className="border-l-4 border-red-500 pl-6 bg-gray-50 rounded-r-xl p-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {report.reviewData.title}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {report.reviewData.message}
              </p>
            </div>

            {report.reviewData.location_name && (
              <div className="flex items-center space-x-2 text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">{report.reviewData.location_name}</span>
              </div>
            )}

            {report.reviewData.image && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Reported Image
                </h4>
                <div className="flex justify-center">
                  <PullImage
                    location={report.reviewData.location_name.split(" ").join("")}
                    url={report.reviewData.image}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
          <Button
            color="red"
            size="lg"
            variant="filled"
            radius="md"
            className="px-8 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleDelete}
            leftSection={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zM12 7a1 1 0 012 0v4a1 1 0 11-2 0V7z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            Delete Report
          </Button>
          <Button
            color="green"
            size="lg"
            variant="filled"
            radius="md"
            className="px-8 shadow-sm hover:shadow-md transition-all duration-200"
            onClick={handleApprove}
            leftSection={
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            }
          >
            Resolve Report
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportWindow;
