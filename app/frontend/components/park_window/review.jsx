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

export function Review({ rev, handleReport, park }) {
  const user = auth.currentUser;

  const [likeCount, setLikeCount] = useState(rev.likes || 0);
  const [liked, setLiked] = useState(false);

  async function isLiked({ rev }) {
    console.log("[Review] Checking if review is liked:", rev.reviewID);
    return await checkIfLiked(user.uid, { rev });
  }

    function handleLike({ rev }) {
    console.log("[Review Section] Handling like for review:", rev.reviewID);
    isLiked({ rev }).then((liked) => {
      console.log("[Review Section] Review liked status:", liked);
      if (liked) {
        console.log(
          "[Review Section] Decrementing like for review:",
          rev.reviewID
        );
        decrementReviewLikes(user.uid, { rev });
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      } else {
        console.log(
          "[Review Section] Incrementing like for review:",
          rev.reviewID
        );
        incrementReviewLikes(user.uid, { rev });
        setLikeCount((prev) => prev + 1);
        setLiked(true);
      }
    });
  }

  function onLiked({ rev }) {
    handleLike({ rev });
  }

  useEffect(() => {
    isLiked({ rev }).then((result) => setLiked(result));
  }, [rev]);

  return (
    <>
      <div className="flex items-start space-x-4">
        <div className="bg-gray-200 rounded-full p-4 flex-shrink-0">
          <PullProfileImageReview user={rev.reviewData} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-lg text-gray-900">
              {rev.displayName || "Anonymous"}
            </h4>
            <span className="text-sm text-gray-500">
              {rev.dateSubmitted
                ? rev.dateSubmitted.toDate().toLocaleDateString()
                : "Unknown Date"}
            </span>
          </div>
          <h5 className="font-semibold text-gray-800 mb-2">{rev.title}</h5>
          <p className="text-gray-700 leading-relaxed mb-4">
            {rev.reviewData.message}
          </p>
          {rev.reviewData.image && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <PullImage
                location={park.name.split(" ").join("")}
                url={rev.reviewData.image}
              />
            </div>
          )}
          <button
            className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors duration-200"
            onClick={() => handleReport({ rev })}
          >
            Report User
          </button>
        </div>
      </div>
      <ActionIcon
        size={42}
        variant="subtle"
        aria-label="Like Review"
        onClick={() => onLiked({ rev })}
      >
        <IconHeart
          size={26}
          className={`transition-transform ${
            liked
              ? "text-red-500 scale-110"
              : "text-gray-400 hover:text-red-400"
          }`}
        />
        <p className={"text-red-500 font-semibold ml-2"}>
          {likeCount || 0}
        </p>
      </ActionIcon>
    </>
  );
}   