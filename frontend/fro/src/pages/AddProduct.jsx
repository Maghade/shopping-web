import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../redux/productSlice";

export default function AddProduct() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.products);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);

  // Handle file selection
  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files)); // multiple files
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !category) {
      alert("Name, Price, and Category are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);

    files.forEach((file) => formData.append("files", file));

    dispatch(addProduct(formData));

    // Optional: Reset form
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setFiles([]);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading && <p className="text-blue-500 mb-2">Processing...</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Images</label>
          <input
            type="file"
            multiple
            onChange={handleFilesChange}
            className="w-full"
            accept=".jpg,.jpeg,.png"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Product
        </button>
      </form>

      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Selected Images:</h4>
          <ul className="list-disc list-inside">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
