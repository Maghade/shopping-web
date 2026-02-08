import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { backendUrl, currency } from "../../App";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
const List = ({ token }) => {
  console.log("token in List:", token);
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

  // Image Preview states
  const [previewImage, setPreviewImage] = useState(null);

  // Delete Confirmation states
  const [deleteProductId, setDeleteProductId] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const addProduct = () => {
    navigate("/products/add");
  };

  const confirmDeleteProduct = (id) => {
    setDeleteProductId(id); // Show confirmation modal
  };

const removeProduct = async () => {
  if (!deleteProductId) return;
  try {
    const response = await axios.post(
      `${backendUrl}/api/product/remove`,
      { id: deleteProductId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token properly
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message);
      fetchList();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || error.message);
  }
  setDeleteProductId(null); // Close confirmation modal
};


  const editProduct = (id) => {
    navigate(`/products/edit/${id}`);
  };

  // Pagination Logic
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex justify-end">
        <button
          onClick={addProduct}
          className="mb-2 px-4 py-2 bg-primary text-white rounded flex items-center gap-2 hover:bg-secondary"
        >
          <FaPlus /> Add Product
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {/* ------- List Table Title ---------- */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ------ Product List ------ */}
     {/* ------ Product List ------ */}
{currentItems.map((item, index) => (
  <div
    className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
    key={index}
  >
    {/* Product Images */}
    {Array.isArray(item.images) && item.images.length > 0 ? (
      <div className="flex gap-2">
        {item.images.map((image, idx) => (
          <img
            key={idx}
            className="w-16 h-16 object-cover rounded-lg border cursor-pointer"
            src={`${backendUrl + image}`}
            alt={`Product image ${idx + 1}`}
            onClick={() => setPreviewImage(`${backendUrl + image}`)} // Preview
          />
        ))}
      </div>
    ) : item.images ? (
      // If single image string
      <img
        className="w-16 h-16 object-cover rounded-lg border cursor-pointer"
        src={`${backendUrl + item.images}`}
        alt="Product"
        onClick={() => setPreviewImage(`${backendUrl + item.images}`)}
      />
    ) : (
      <p>No Image</p>
    )}

    {/* Product Name */}
    <p>{item.name}</p>

    {/* Category */}
    <p>{item.category?.name || "No Category"}</p>

    {/* Price */}
    <p>
      {currency}
      {item.price}
    </p>

    {/* Actions */}
    <div className="flex justify-center gap-3">
      <FaEdit
        className="cursor-pointer text-gray-600 hover:text-blue-600"
        onClick={() => editProduct(item._id)}
        title="Edit"
      />
      <FaTrash
        className="cursor-pointer text-red-600 hover:text-red-800"
        onClick={() => confirmDeleteProduct(item._id)}
        title="Delete"
      />
    </div>
  </div>
))}

      </div>

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
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-gray-300" : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <button
              className="absolute top-2 right-2 text-black text-lg"
              onClick={() => setPreviewImage(null)}
            >
              <FaTimes />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteProductId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={removeProduct}
              >
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setDeleteProductId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} 
    </>
  );
};
export default List;
