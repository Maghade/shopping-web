

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";

const BundleList = () => {
  const navigate = useNavigate();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/bundle/getlist`);
        setBundles(response.data.bundles);
      } catch (err) {
        setError("Error fetching bundles.");
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  const addBundle = () => navigate("/bundle/add");
  const editBundle = (id) => navigate(`/bundle/update/${id}`);

  const deleteBundle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bundle?")) return;
    try {
      await axios.delete(`${backendUrl}/api/bundle/delete/${id}`);
      setBundles(bundles.filter((bundle) => bundle._id !== id));
      toast.success("Bundle deleted successfully");
    } catch (err) {
      toast.error("Failed to delete bundle");
    }
  };

  if (loading) return <p className="text-center text-gray-600 mt-4">Loading bundles...</p>;
  if (error) return <p className="text-center text-red-600 mt-4">{error}</p>;

  const totalPages = Math.ceil(bundles.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bundles.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">All Bundles</h2>
        <button
          onClick={addBundle}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          <FaPlus /> Add Bundle
        </button>
      </div>

      <div className="space-y-4">
        {currentItems.map((bundle) => (
          <div
            key={bundle._id}
            className="border rounded-lg shadow-sm p-4 bg-white space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1 space-y-1">
                <p className="text-lg font-semibold text-gray-900">{bundle.name}</p>
                <p className="text-sm text-gray-600">Category: {bundle.category}</p>
                <p className="text-sm text-gray-600">
                  Coupon: {bundle.coupons?.[0] || "No Coupons"}
                </p>
              </div>
              <div className="mt-3 md:mt-0 flex gap-4">
                <FaEdit
                  className="cursor-pointer text-blue-600 hover:text-blue-800"
                  onClick={() => editBundle(bundle._id)}
                  title="Edit"
                  size={18}
                />
                <FaTrash
                  className="cursor-pointer text-red-600 hover:text-red-800"
                  onClick={() => deleteBundle(bundle._id)}
                  title="Delete"
                  size={18}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {bundle.products?.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 border p-2 rounded bg-gray-50"
                >
                  <img
                    src={`${backendUrl}${product.images?.[0]}`}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded border"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">£ {product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-black text-white" : "bg-white hover:bg-gray-100"
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BundleList;
