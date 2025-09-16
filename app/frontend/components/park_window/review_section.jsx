import users from "../admin/user_test_data.json";

function Reviews({}) {
  let reviews = users.reviews;

  function handleData({ user }) {
    alert(`${user.username} has been reported.`);
  }

  return (
    <ul>
      {reviews.map((user, index) => (
        <div key={index} className="">
          <div className="flex flex-row gap-0 mx-4 my-18 space-x-6">
            <div className="">
              <img
                className="w-25 h-25 bg-gray-400 rounded-full"
                alt="profile picture"
              />
            </div>
            <div className="space-y-2">
              <div className=" flex flex-row space-x-2 items-center">
                <p className=" font-semibold text-1xl">{user.username}</p>
                <p className=" text-1xl italic">- {user.date}</p>
              </div>
              {user.images && user.images.length > 0 && (
                <ul className="flex flex-row justify-center bg-gray-100 rounded-lg shadow-inner p-2 space-x-8 overflow-x-auto">
                  {user.images.map((img, index) => (
                    <>
                      <img
                        key={index}
                        src={img}
                        alt={img}
                        className="w-30 h-30 bg-gray-400 rounded"
                      />
                    </>
                  ))}
                </ul>
              )}
              <div className="grid grid-cols-3">
                <p className=" col-span-2">{user.comment}</p>
                <p
                  className="hover:underline italic flex justify-end items-end"
                  onClick={() => handleData({ user })}
                >
                  Report User
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ul>
  );
}

export default Reviews;
