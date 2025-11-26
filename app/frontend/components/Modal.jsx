/*

The youtube video I referenced for this code: https://www.youtube.com/watch?v=nwJK-jo91vA


Steps to use:

  1. Have a useCase for the Modal in the desired file.
    ex.  const [showModal, setShowModal] = useState(false);

  2. Import the Modal to the file and use this.
    ex. <Modal isVisible={showModal} onClose={() => setShowModal(false)}>**Content goes here**</Modal>
    
    NOTE: If any button or action other than the X button on the Modal closes it, make sure to pass the function.

*/

import { Transition } from "@mantine/core";

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  let content = children;

  const handleClose = (e) => {
    // If clicked outside of the window.
    if (e.target.id == "wrapper") onClose();
  };

  return (
    <div
      className="fixed inset-0 backdrop-opacity-35 z-150 backdrop-brightness-0 flex justify-center items-center p-4"
      id="wrapper"
      onClick={handleClose}
    >
      <Transition
        mounted={isVisible}
        transition="slide-up"
        duration={300}
        timingFunction="ease-out"
      >
        {(styles) => (
          <div
            style={styles}
            className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-y-auto"
          >
            <div className="bg-white rounded-xl shadow-2xl relative">
              <button
                className="absolute top-4 right-4 z-10 m-4 opacity-75 bg-white hover:bg-gray-200 text-black py-6 px-6 rounded-lg text-lg font-bold shadow-md hover:shadow-lg transition-all"
                onClick={onClose}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {content}
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
};

export default Modal;
