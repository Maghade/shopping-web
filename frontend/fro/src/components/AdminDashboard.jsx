import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../redux/productSlice";
import { fetchCategories } from "../redux/categorySlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    editId: null, // ✅ store editing product id
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, price, category, image, editId } = formData;

    if (editId) {
      // ✅ Edit existing product
      dispatch(updateProduct({ id: editId, updatedData: { name, price, category, image } }));
    } else {
      // ✅ Add new product
      dispatch(addProduct({ name, price, category, image }));
    }

    // reset form
    setFormData({ name: "", price: "", category: "", image: "", editId: null });
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      editId: product._id, // set edit mode
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-5">Admin Dashboard</h1>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      <select
  name="category"
  value={formData.category}
  onChange={handleChange}
  className="border p-2 w-full"
  required
>
  <option value="">Select Category</option>

  {/* Default suggestions */}
  {["Fruit", "Flower", "Metal", "Vegetable"].map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}

  {/* Categories from backend */}
  {categories.map((cat) => (
    <option key={cat._id} value={cat._id}>
      {cat.name}
    </option>
  ))}
</select>

        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {formData.editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product List */}
      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div className="border p-3 rounded shadow">
            <img
              src={product.image || "/images/default-product.jpg"}
              alt={product.name}
              className="w-full h-40 object-cover mb-2"
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p>${product.price}</p>
            <p>Category: {product.category}</p>
            <div className="flex gap-2 mt-2">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(product._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
