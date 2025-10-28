import { approveReview } from "@/app/backend/database";
import { PullImage } from "@/app/backend/uploadStorage";

function ReviewWindow({ user: rev, onClose, onDeleteReview }) {


  function handleDelete() {
    onClose();
    onDeleteReview();
    alert("Review Deleted!");
  }

  function handleApprove() {
    approveReview(rev);
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
        <p className=" text-4xl font-semibold">{rev.displayName || "Anonymous"}</p>
        <p className=" text-3xl">{rev.title}</p>
        <p className=" text-2xl text-left">{rev.message}</p>
      </div>

      {rev.image && (
        <ul className="flex flex-row justify-center bg-gray-100 rounded-lg shadow-inner p-2 space-x-8 overflow-x-auto">
          <PullImage location={park.name.split(' ').join('')} url={rev.image} />
        </ul>
      )}
      <div>
        <button onClick={handleDelete} className="red-button">
          Delete
        </button>
        <button onClick={handleApprove}>Approve</button>
      </div>
    </div>
  );
}

export default ReviewWindow;
