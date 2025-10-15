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
          <div className="grid grid-cols-3 gap-4 m-4">
            <p className=" mt-6 mr-8 font-semibold text-2xl">{rev.username}</p>
            <p className=" mt-6 mr-8 text-1xl">Submited: {rev.date}</p>
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
