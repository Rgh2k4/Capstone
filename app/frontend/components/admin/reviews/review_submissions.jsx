import { Button } from "@mantine/core";
import users from "../user_test_data.json";

function ReviewSubmissions({ handleReview, reviews }) {
  function handleData({ rev }) {
    console.log("Data:");
    console.log(rev);

    handleReview(rev);
  }
  return (
    <ul>
      {reviews.map((rev, index) => (
        <div key={index} className="border-b-4 border-gray-300">
          <div className="grid grid-cols-4 gap-4 m-4">
            <p className=" mt-6 mr-8 font-bold text-1xl">{rev.reviewData.uid ? rev.uid.slice(0,5) + "...": "N/A"}</p>
            <p className=" mt-6 mr-8 text-1xl">Submited: {rev.dateSubmitted}</p>
            <Button
              className="w-full"
              size="lg"
              variant="filled"
              onClick={() => handleData({ rev })}
            >
              Review
            </Button>
          </div>
        </div>
      ))}
    </ul>
  );
}

export default ReviewSubmissions;
