import { useState } from 'react';
import Modal from '../Modal';
import ReviewWindow from './review_window'
import users from './users.json';

function ReviewList() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser ] = useState(null);
  let reviews = users.reviews;

  function handleReview({user}) {
    setUser(user);
    setShowModal(true);
  }

  function handleClose() {
    setUser(user);
    setShowModal(true);
  }


  return (
    <section>
        <div>
            <p>Reviews</p>
        </div>
        <div>
            <ul className="bg-gray-100 rounded-lg shadow-inner p-4 space-y-4 overflow-y-auto max-h-[500px]">
            {reviews.map((rev, index) => (
              <>
                <p key={index}>{rev.username}</p>
                <p key={index}>{rev.date}</p>
                <button key={index} onClick={() => handleReview({rev})}>Review</button>
                <Modal isVisible={showModal} onClose={() => setShowModal(false)}><ReviewWindow user={rev}/></Modal>
              </>
            ))}
            </ul>

        </div>

    </section>
  )
}

export default ReviewList