import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();

  // Fetch Category List
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/category/list`);
      if (response.data.success) {
        setList(response.data.categories.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Remove Category
  const removeCategory = async (id) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/category/remove`,
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const editCategory = (id) => {
    navigate(`/products/category/edit/${id}`);
  };

  const addCategory = () => {
    navigate("/products/category/add");
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2 text-lg font-semibold">All Category List</p>

      <div className="flex justify-end">
        <button
          onClick={addCategory}
          className="mb-2 px-4 py-2 bg-primary text-white rounded flex items-center gap-2 hover:bg-green-700 transition-colors"
        >
          <FaPlus /> Add Category
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-bold">
          <p>Image</p>
          <p>Name</p>
          <p className="text-center">Action</p>
        </div>

        {/* Rows */}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr_1fr] items-center gap-2 py-2 px-4 border text-sm"
              key={index}
            >
              {/* Image Column */}
              <div>
                {Array.isArray(item.images) && item.images.length > 0 ? (
                  <div className="flex gap-2">
                    {item.images.map((image, idx) => (
                      <img
                        key={idx}
                        className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                        src={`${backendUrl + image}`}
                        alt="Category"
                        title="Click to view"
                        onClick={() => setPreviewImage(`${backendUrl + image}`)}
                      />
                    ))}
                  </div>
                ) : item.images ? (
                  <img
                    className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                    src={`${backendUrl + item.images}`}
                    alt="Category"
                    title="Click to view"
                    onClick={() => setPreviewImage(`${backendUrl + item.images}`)}
                  />
                ) : (
                  <p>No Image</p>
                )}
              </div>

              {/* Name Column */}
              <p>{item.name}</p>

              {/* Action */}
              <div className="flex justify-center gap-3 text-lg">
                <FaEdit
                  className="cursor-pointer text-secondary hover:text-primary transition"
                  onClick={() => editCategory(item._id)}
                  title="Edit Category"
                />

                <FaTrash
                  className="cursor-pointer text-red-600 hover:text-red-800 transition"
                  onClick={() => removeCategory(item._id)}
                  title="Remove Category"
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-2 px-4 border text-center text-sm text-gray-500">
            No records found
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white p-3 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-black text-xl"
              onClick={() => setPreviewImage(null)}
            >
              <FaTimes />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default List;
