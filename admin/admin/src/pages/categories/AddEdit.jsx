

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const AddEdit = ({ token }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  // 🔹 Fetch category data when editing
  useEffect(() => {
    if (id) {
      fetchCategoryData();
    }
  }, [id]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/category/single/${id}`);
      if (response.data.success) {
        const cat = response.data.category;
        setName(cat.name);

        if (cat.images && cat.images.length > 0) {
          const imageUrls = cat.images.map((img) => `${backendUrl}${img}`);
          setPreviewUrls(imageUrls);

          const fileObjs = await Promise.all(
            imageUrls.map(async (url) => {
              try {
                const res = await fetch(url);
                const blob = await res.blob();
                const fileName = url.split("/").pop();
                return new File([blob], fileName, { type: blob.type });
              } catch {
                return null;
              }
            })
          );
          setFiles(fileObjs.filter(Boolean));
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🖼 Handle image file changes
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);

      const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    try {
      URL.revokeObjectURL(previewUrls[index]);
    } catch {}
    setFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  // 🔹 Submit (Add / Update)
const onSubmitHandler = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append("name", name);

 if (files.length > 0) {
  files.forEach((file) => formData.append("images", file)); // ✅ plural
}



    let response;

    // ✅ include proper headers
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        token, // assuming your backend uses this for auth
      },
    };

    if (id) {
      response = await axios.put(
        `${backendUrl}/api/category/update/${id}`,
        formData,
        config
      );
    } else {
      response = await axios.post(
        `${backendUrl}/api/category/add`,
        formData,
        config
      );
    }

    if (response.data.success) {
      toast.success(response.data.message);
      onFinishHandler();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error("❌ Upload error:", error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

  const onFinishHandler = () => {
    setName("");
    setFiles([]);
    previewUrls.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch {}
    });
    setPreviewUrls([]);
    navigate("/products/category");
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4">
      <h2 className="text-xl font-bold mb-4">{id ? "Edit Category" : "Add Category"}</h2>

      {/* Category Name */}
      <div className="w-full">
        <p className="mb-2 font-medium">Category Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2 border border-gray-300 rounded"
          type="text"
          placeholder="Type here"
          required
          disabled={loading}
        />
      </div>

      {/* Image Upload */}
      <div className="w-full">
        <p className="mb-2 font-medium">Category Images</p>
        <label className="cursor-pointer border p-2 rounded bg-gray-100 hover:bg-gray-200">
          Upload Images
    <input
  type="file"
  accept="image/*"
  multiple
  hidden
  onChange={handleFileChange}
/>

        </label>

        {/* Image Previews */}
        <div className="flex flex-wrap gap-4 mt-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-28 h-28 object-cover rounded-lg border"
              />
              <button
                onClick={() => removeImage(index)}
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          type="submit"
          className="w-28 py-3 bg-primary hover:bg-gray-800 text-white rounded disabled:opacity-50"
          disabled={loading}
        >
          {id ? "UPDATE" : "ADD"}
        </button>

        <button
          type="button"
          className="w-28 py-3 bg-secondary hover:bg-gray-800 text-white rounded disabled:opacity-50"
          onClick={onFinishHandler}
          disabled={loading}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
};

export default AddEdit;
