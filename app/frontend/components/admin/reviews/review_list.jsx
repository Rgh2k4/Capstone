import ReviewSubmissions from "./review_submissions";

function ReviewList({ setShowModal, sendUser, reviews, showHeader }) {
  const handleReview = (user) => {
    console.log("Data Recieved:");
    console.log(user);
    sendUser(user);
    setShowModal(true);
  };

  return (
    <section className=" bg-gray-100 drop-shadow-md drop-shadow-gray-400">
      {showHeader && (
        <div className="flex justify-center text-4xl font-bold bg-gray-300 p-4 space-y-4 overflow-y-auto drop-shadow-sm drop-shadow-gray-400">
          <p>Reviews</p>
        </div>
      )}
      <div className="rounded-b-lg p-4 overflow-y-auto">
        <ReviewSubmissions handleReview={handleReview} reviews={reviews}/>
      </div>
    </section>
  );
}

export default ReviewList;
