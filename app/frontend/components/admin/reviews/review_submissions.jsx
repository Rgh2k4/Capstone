import { Button } from "@mantine/core";
import users from "../user_test_data.json";

function ReviewSubmissions({ handleReview, reviews }) {
  function handleData({ rev }) {
    console.log("Data:");
    console.log(rev);

    handleReview(rev);
  }
  return (
    <div className="space-y-4">
      {reviews.map((rev, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">User ID</p>
                <p className="text-sm text-gray-500">{rev.reviewData.uid ? rev.reviewData.uid.slice(0,7) + "...": "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-full p-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Submitted</p>
                <p className="text-sm text-gray-500">{rev.dateSubmitted ? new Date(rev.dateSubmitted.seconds * 1000).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Title</p>
                <p className="text-sm text-gray-500 truncate">{rev.reviewData.title || "No title"}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                size="md"
                variant="filled"
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                onClick={() => handleData({ rev })}
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

export default ReviewSubmissions;
