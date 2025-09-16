function ReviewWindow({ user, onClose }) {
  let photos = user.images;
  let hasImage = false;

  function checkImages(photos) {
    if (!photos[0] == "" || null) hasImage = true;
  }

  function handleDelete() {
    onClose();
  }

  function handleApprove() {
    onClose();
  }

  checkImages(photos);

  return (
    <div className=" p-12 rounded flex flex-col justify-center text-center space-y-24">
      <div className="flex justify-center text-center">
        <img
          className="w-50 h-50 bg-gray-400 rounded-full"
          alt="profile picture"
        />
      </div>
      <div className="space-y-6">
        <p className=" text-4xl font-semibold">{user.username}</p>
        <p className=" text-2xl text-left">{user.comment}</p>
      </div>
      {hasImage && (
        <div>
          <ul className="flex flex-row justify-center bg-gray-100 rounded-lg shadow-inner p-4 space-x-8 overflow-x-auto max-h-[500px]">
            {photos.map((img, index) => (
              <>
                <img
                  key={index}
                  src={img}
                  alt={img}
                  className="w-50 h-50 bg-gray-400 rounded"
                />
              </>
            ))}
          </ul>
        </div>
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
