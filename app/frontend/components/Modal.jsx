/*

The youtube video I referenced for this code: https://www.youtube.com/watch?v=nwJK-jo91vA

*/

const Modal = ({isVisible, onClose, children}) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if ( e.target.id == 'wrapper' ) onClose();
  }
  
  return (
    <div className=' fixed inset-0 backdrop-opacity-35 backdrop-brightness-0 flex justify-center items-center' id='wrapper' onClick={() => handleClose()}>
      <div className=' max-w-1/2 max-h-screen overflow-y-scroll'>
        <div className=' bg-white p-2 rounded'>
          <div className="absolute left-2/3">
            <button className='modal-close' onClick={() => onClose()}>X</button>
          </div>
          <div>
            {children}            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal