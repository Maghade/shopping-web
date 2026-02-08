



import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../App';
import { toast } from 'react-toastify';

const ReviewList = ({ token }) => {
  const [reviews, setReviews] = useState([]);
  const [list, setList] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/reviews`, {
        headers: { token },
      });

      if (response.data.success) {
        setReviews(response.data.reviews);
        setList(response.data.reviews); // for pagination
      } else {
        toast.error(response.data.message || "Failed to fetch reviews.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred while fetching reviews.");
      } else if (error.request) {
        toast.error("No response received from the server.");
      } else {
        toast.error("An error occurred while fetching reviews.");
      }
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id, isApproved) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/order/reviews/${id}/approve`,
        { approved: !isApproved },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Review status updated.');
        fetchReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating review status:", error);
      toast.error('Failed to update review status.');
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className='p-5'>
      <h3 className='text-xl font-bold mb-4'>Review Management</h3>

      <table className='w-full border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-200'>
            <th className='border p-2'>Product Name</th>
            <th className='border p-2'>Rating</th>
            <th className='border p-2'>Review</th>
            <th className='border p-2'>Approval</th>
            <th className='border p-2'>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((review) => (
              <tr key={review._id} className='text-center'>
                <td className='border p-2'>{review.productId?.name || 'N/A'}</td>
                <td className='border p-2'>{review.rating}/5</td>
                <td className='border p-2'>{review.review}</td>
                <td className='border p-2'>
                  <input
                    type='checkbox'
                    checked={review.approved}
                    onChange={() => toggleApproval(review._id, review.approved)}
                  />
                </td>
                <td className='border p-2'>{new Date(review.date).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='5' className='text-center p-4'>No reviews available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? "bg-gray-300" : ""}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReviewList;
