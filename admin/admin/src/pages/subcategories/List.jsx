


import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";

const SubcategoryList = ({ token }) => {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubcategories();
  }, []);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/subcategory/list`);
      if (data.success) {
        setSubcategories(data.subcategories || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch subcategories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      setLoading(true);
      const { data } = await axios.delete(`${backendUrl}/api/subcategory/delete/${id}`, {
        headers: { token },
      });

      if (data.success) {
        toast.success("Subcategory deleted successfully");
        setSubcategories((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting subcategory");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/products/subcategory/edit/${id}`);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Subcategory List</h2>
        <Link
          to="/products/subcategory/add"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          + Add Subcategory
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : subcategories.length === 0 ? (
        <p className="text-center text-gray-500">No subcategories found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                 <th className="py-3 px-4 text-left">Subcategory Name</th>

                <th className="py-3 px-4 text-left">Category</th> {/* ✅ New column */}
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subcategory, index) => (
                <tr key={subcategory._id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">
                    {subcategory.category?.name || "—"} {/* ✅ Display category name */}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {Array.isArray(subcategory.name)
                      ? subcategory.name.join(", ")
                      : subcategory.name}
                  </td>
                  <td className="py-3 px-4 flex gap-3">
                    <FaEdit
                      className="cursor-pointer text-gray-600 hover:text-blue-600"
                      onClick={() => handleEdit(subcategory._id)}
                      title="Edit"
                    />
                    <FaTrash
                      className="cursor-pointer text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(subcategory._id)}
                      title="Delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubcategoryList;
