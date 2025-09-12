const Modal = ({isVisible, onClose, children}) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if ( e.target.id === 'wrapper' ) onClose();
  }
  
  return (
    <div className=' fixed inset-0 bg-black  bg-opacity-25 backdrop-blur-sm flex justify-center items-center' id='wrapper' onClick={() => handleClose()}>
      <div className=' w-[600px]'>
        <div className=' bg-white p-2 rounded'>
          <button className=' bg-blue-300 rounded-b-md absolute p-6 m-6' onClick={() => onClose()}>X</button>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal