import { Button } from "@mantine/core";

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

  return (
    <div className=" p-12 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex justify-center text-center">
        <img
          className="w-50 h-50 bg-gray-400 rounded-full"
          alt="profile picture"
        />
      </div>

      <div className="space-y-6">
        <p className=" text-2xl font-bold">Offending User</p>
        <p className=" text-1xl italic">{report.reportedUserID}</p>
        <p className=" text-2xl font-bold">Reporting User</p>
        <p className=" text-1xl italic">{report.reporterUserID}</p>
        <p className=" text-2xl">{report.reason}</p>
      </div>

      <div className="space-y-6">
        <p className=" text-3xl">{report.reviewData.title}</p>
        <p className=" text-2xl text-left">{report.reviewData.message}</p>
      </div>
      {report.reviewData.image && (
        <ul className="flex flex-row justify-center bg-gray-100 rounded-lg shadow-inner p-2 space-x-8 overflow-x-auto">
          <PullImage
            location={report.reviewData.location_name.split(" ").join("")}
            url={report.reviewData.image}
          />
        </ul>
      )}
      <div className="space-x-12">
        <Button color="red" onClick={handleDelete}>
          Delete
        </Button>
        <Button onClick={handleApprove}>Approve</Button>
      </div>
    </div>
  );
}

export default ReportWindow;
