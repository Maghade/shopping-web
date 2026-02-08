
import React, { useState } from "react";
import Modal from "react-modal";
import ReactStars from "react-stars";

const ReviewModal = ({ isOpen, onRequestClose, onSubmit, item }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

 
  const handleSubmit = () => {
    console.log("Submitting Review Data:", { rating, review });
    onSubmit(item.productId, { rating, review });
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Review Modal"
      ariaHideApp={false}
      className="bg-white p-6 rounded-lg shadow-lg w-96 mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Review {item?.name}
      </h2>
      <ReactStars
        count={5}
        value={rating}
        onChange={handleRatingChange}
        size={30}
        color2="#ffd700"
      />
      <textarea
        className="w-full mt-4 p-2 border rounded focus:ring-2 focus:ring-blue-500"
        rows="4"
        placeholder="Write your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button
          onClick={onRequestClose}
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ReviewModal;
