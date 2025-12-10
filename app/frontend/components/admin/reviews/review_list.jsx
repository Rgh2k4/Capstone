import ReviewSubmissions from "./review_submissions";

function ReviewList({ setShowModal, sendUser, reviews, showHeader }) {
  const handleReview = (user) => {
    console.log("Data Recieved:");
    console.log(user);
    sendUser(user);
    setShowModal(true);
  };

  return (
    <div className="h-full flex flex-col">
      {showHeader && (
        <div className="bg-blue-50 border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Pending Reviews ({reviews.length})</h2>
          </div>
        </div>
      )}
      <div className="flex-1 p-6 overflow-y-auto">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">No pending reviews</p>
          </div>
        ) : (
          <ReviewSubmissions handleReview={handleReview} reviews={reviews}/>
        )}
      </div>
    </div>
  );
}

export default ReviewList;
