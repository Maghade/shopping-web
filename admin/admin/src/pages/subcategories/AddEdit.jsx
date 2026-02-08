

import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SubcategoryAddEdit = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [subcategoryData, setSubcategoryData] = useState({
    name: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // For edit mode

  // 🔹 Fetch all categories for dropdown
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/category/list`);
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch categories");
    }
  };

  // 🔹 Fetch subcategory details (if editing)
  const fetchSubcategory = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/subcategory/get/${id}`);
      if (data.success) {
        setSubcategoryData({
          name: data.subcategory.name,
          category: data.subcategory.category?._id || "",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch subcategory details");
    }
  };

  useEffect(() => {
    fetchCategories();
    if (id) fetchSubcategory();
  }, [id]);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubcategoryData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subcategoryData.name || !subcategoryData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", subcategoryData.name);
    formData.append("category", subcategoryData.category);
    // if (image) formData.append("image", image);

    try {
      setLoading(true);
      const config = { headers: { token } };

      let response;
      if (id) {
        response = await axios.put(`${backendUrl}/api/subcategory/update/${id}`, formData, config);
      } else {
        response = await axios.post(`${backendUrl}/api/subcategory/add`, formData, config);
      }

      if (response.data.success) {
        toast.success(id ? "Subcategory updated successfully" : "Subcategory added successfully");
        navigate("/products/subcategory");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        {id ? "Edit Subcategory" : "Add Subcategory"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
          {/* Category Dropdown */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">Category</label>
          <select
            name="category"
            value={subcategoryData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory Name */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">Subcategory Name</label>
          <input
            type="text"
            name="name"
            value={subcategoryData.name}
            onChange={handleChange}
            placeholder="Enter subcategory name"
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
            required
          />
        </div>

      
   

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-white w-full py-2 rounded-md hover:bg-gray-800 transition"
        >
          {loading ? "Saving..." : id ? "Update Subcategory" : "Add Subcategory"}
        </button>
      </form>
    </div>
  );
};

export default SubcategoryAddEdit;
