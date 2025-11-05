import { PullImage } from "@/app/backend/uploadStorage";
import { Button, Divider } from "@mantine/core";

function ReviewWindow({ user: rev, onClose, onHandleReview }) {
  function handleDelete() {
    onHandleReview(rev, "delete");
    onClose();
  }

  function handleApprove() {
    onHandleReview(rev, "approve");
    onClose();
  }

  return (
    <div className="w-full mx-auto bg-white shadow-2xl rounded-2xl p-24 flex flex-col items-center space-y-8 border border-gray-200">
      
      <div className="w-full text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Review Approval
        </h2>
        <p className="text-gray-500 text-sm">
          Approve or remove this review submission.
        </p>
      </div>

      <Divider className="w-full" />

      <div className="flex flex-col items-center space-y-4">
        <img
          className="w-24 h-24 bg-gray-200 rounded-full object-cover shadow-md"
          src={rev.reviewData.profilePic || "/defaultUser.png"}
          alt="User profile"
        />
        <p className="text-xl font-semibold text-gray-800">
          {rev.reviewData.displayName || "Anonymous"}
        </p>
        <p className="text-sm text-gray-500 italic">
          UID: {rev.reviewData.uid || "N/A"}
        </p>
      </div>

      <Divider className="w-full" />

      <div className="w-full text-left space-y-4">
        <h3 className="text-2xl font-semibold text-blue-800">
          {rev.reviewData.title}
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg">
          {rev.reviewData.message}
        </p>
      </div>

      {rev.reviewData.image && (
        <div className="w-full mt-4 bg-gray-50 border rounded-xl shadow-inner p-3 overflow-x-auto flex justify-center">
          <PullImage
            location={rev.reviewData.location_name.split(" ").join("")}
            url={rev.reviewData.image}
          />
        </div>
      )}

      <div className="flex justify-center space-x-6 mt-6">
        <Button
          color="red"
          size="md"
          variant="filled"
          radius="md"
          className="shadow-sm hover:shadow-md transition-all"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          color="green"
          size="md"
          variant="filled"
          radius="md"
          className="shadow-sm hover:shadow-md transition-all"
          onClick={handleApprove}
        >
          Approve
        </Button>
      </div>
    </div>
  );
}

export default ReviewWindow;
