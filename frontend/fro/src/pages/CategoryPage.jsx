

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";
import { fetchCategories } from "../redux/categorySlice";
import ProductDetail from "./ProductDetails";

export default function CategoryPage() {
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  const { categories = [] } = useSelector((state) => state.categories || {});
  const { products = [], loading, error } = useSelector(
    (state) => state.products || {}
  );

  const [subCategory, setSubCategory] = useState("");

  // 🔹 Fetch categories only once
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // 🔹 Fetch products whenever categoryId or subCategory changes
  useEffect(() => {
    if (categoryId) {
      const params = { category: categoryId };
      if (subCategory) params.subCategory = subCategory;
      dispatch(fetchProducts(params));
    }
  }, [dispatch, categoryId, subCategory]);

  const selectedCategory =
    categories.find((cat) => cat._id === categoryId) || {};

  if (loading) return <p className="text-center mt-10">Loading products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="spad">
      <div className="container mt-4">
        <h2 className="text-2xl font-bold mb-6 text-center">
          List of Products for Category:{" "}
          {selectedCategory.name || "Category"}
        </h2>

        {/* 🔸 Subcategory Dropdown */}
        {selectedCategory.subcategories?.length > 0 && (
          <div className="mb-6 flex justify-center">
            <select
              className="border px-4 py-2 rounded"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="">All Subcategories</option>
              {selectedCategory.subcategories.map((sub) => (
                <option key={sub._id || sub} value={sub._id || sub}>
                  {sub.name || sub}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 🔸 Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No products available for this category.
            </p>
          ) : (
            products.map((p) => <ProductDetail key={p._id} product={p} />)
          )}
        </div>
      </div>
    </section>
  );
}