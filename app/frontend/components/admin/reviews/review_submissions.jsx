import users from "../user_test_data.json";

function ReviewSubmissions( { handleReview }) {
  let reviews = users.reviews;

  function handleData({ rev }) {
    console.log("Data:");
    console.log(rev);
    
    handleReview(rev);
  }
  return (
    <ul>
      {reviews.map((rev, index) => (
          <div key={index} className="border-b-4 border-gray-300">
            <div className="grid grid-cols-3 gap-4 m-4">
              <p className=" mt-6 mr-8 font-semibold text-3xl">
                {rev.username}
              </p>
              <p className=" mt-6 mr-8 text-2xl">
                Submited: {rev.date}
              </p>
              <button onClick={() => handleData({rev})}>
                Review
              </button>
            </div>
          </div>
      ))}
    </ul>
  );
}

export default ReviewSubmissions;
