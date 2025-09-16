/*

The youtube video I referenced for this code: https://www.youtube.com/watch?v=nwJK-jo91vA


Steps to use:

  1. Have a useCase for the Modal in the desired file.
    ex.  const [showModal, setShowModal] = useState(false);

  2. Import the Modal to the file and use this.
    ex. <Modal isVisible={showModal} onClose={() => setShowModal(false)}>**Content goes here**</Modal>
    
    NOTE: If any button or action other than the X button on the Modal closes it, make sure to pass the function.

*/

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    // If clicked outside of the window.
    if (e.target.id == "wrapper") onClose();
  };

  return (
    <div
      className=" fixed inset-0 backdrop-opacity-35 backdrop-brightness-0 flex justify-center items-center"
      id="wrapper"
      onClick={() => handleClose(event)}
    >
      <div className=" max-w-1/2 max-h-screen overflow-y-scroll">
        <div className=" bg-white p-2 rounded">
          <div className="absolute left-2/3">
            <button className="modal-close" onClick={() => onClose()}>
              X
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
