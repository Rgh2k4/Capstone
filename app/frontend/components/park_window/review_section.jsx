import {
  checkIfLiked,
  decrementReviewLikes,
  incrementReviewLikes,
} from "@/app/backend/database";
import { auth } from "@/app/backend/databaseIntegration";
import { PullImage, PullProfileImageReview } from "@/app/backend/uploadStorage";
import { ActionIcon } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Review } from "./review";

function ReviewSection({ handleReport, park, reviews }) {

  function handleData({ user }) {
    toast(`${user.username} has been reported.`);
  }

  return (
    <div className="space-y-6">
      {reviews.map((rev, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
        >
          <Review
            rev={rev}
            handleReport={handleReport}
            park={park}
          />
        </div>
      ))}
    </div>
  );
}


export default ReviewSection;
