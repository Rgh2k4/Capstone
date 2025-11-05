import { approveReview } from "@/app/backend/database";
import { PullImage } from "@/app/backend/uploadStorage";
import { Button } from "@mantine/core";

function ReviewWindow({ user: rev, onClose, onHandleReview }) {


  function handleDelete() {
    onClose();
    onHandleReview(rev, "delete");
    alert("Review Deleted!");
  }

  function handleApprove() {
    onHandleReview(rev, "approve");
    onClose();
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
        <p className=" text-4xl font-semibold">{rev.reviewData.uid || "Anonymous"}</p>
        <p className=" text-3xl">{rev.reviewData.title}</p>
        <p className=" text-2xl text-left">{rev.reviewData.message}</p>
      </div>

      {rev.reviewData.image && (
        <ul className="flex flex-row justify-center bg-gray-100 rounded-lg shadow-inner p-2 space-x-8 overflow-x-auto">
          <PullImage location={rev.reviewData.location_name.split(' ').join('')} url={rev.reviewData.image} />
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

export default ReviewWindow;
