import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCategory, fetchProducts } from "../redux/productSlice";

export default function CategoryDropdown() {
  const dispatch = useDispatch();
  const { selectedCategory, searchTerm } = useSelector(
    (state) => state.products
  );

  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [openSubCategory, setOpenSubCategory] = useState(null);
  const [showMore, setShowMore] = useState(false);

  // ✅ Fetch categories with subcategories & sub-subcategories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/category/list`);
        const data = await res.json();

        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // ✅ Limit visible categories
  const visibleCategories = showMore ? categories : categories.slice(0, 10);

  // ✅ Handle selection
  const handleCategorySelect = (id) => {
    dispatch(setCategory(id));
    dispatch(fetchProducts({ category: id, name: searchTerm }));
  };

  return (
    <div className="w-64 border rounded-lg shadow bg-white p-3">
      <h2 className="font-semibold text-gray-700 mb-2">Categories</h2>
      <ul className="space-y-2">
        <li>
          {/* All option */}
          <button
            className={`w-full text-left px-2 py-1 rounded ${
              selectedCategory === "All"
                ? "bg-blue-100 font-semibold"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleCategorySelect("All")}
          >
            All
          </button>
        </li>

        {visibleCategories.map((cat, i) => (
          <li key={cat._id}>
            {/* Main Category */}
            <button
              className="w-full flex justify-between items-center text-left px-2 py-1 hover:bg-gray-100 rounded"
              onClick={() => setOpenCategory(openCategory === i ? null : i)}
            >
              {cat.name}
              {cat.subcategories && cat.subcategories.length > 0 && (
                <i
                  className={`fa fa-chevron-${
                    openCategory === i ? "up" : "down"
                  } text-xs`}
                />
              )}
            </button>

            {/* Subcategories */}
            {openCategory === i &&
              cat.subcategories &&
              cat.subcategories.length > 0 && (
                <ul className="ml-4 mt-1 border-l pl-2 space-y-1">
                  {cat.subcategories.map((sub) => (
                    <li key={sub._id}>
                      <button
                        className="w-full flex justify-between items-center text-left px-2 py-1 hover:bg-gray-50 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenSubCategory(
                            openSubCategory === sub._id ? null : sub._id
                          );
                        }}
                      >
                        {sub.name}
                        {sub.subSubCategories &&
                          sub.subSubCategories.length > 0 && (
                            <i
                              className={`fa fa-chevron-${
                                openSubCategory === sub._id ? "up" : "down"
                              } text-xs`}
                            />
                          )}
                      </button>

                      {/* Sub-Subcategories */}
                      {openSubCategory === sub._id &&
                        sub.subSubCategories &&
                        sub.subSubCategories.length > 0 && (
                          <ul className="ml-4 mt-1 border-l pl-2 space-y-1">
                            {sub.subSubCategories.map((item) => (
                              <li
                                key={item._id}
                                className={`cursor-pointer text-sm text-gray-600 hover:underline ${
                                  selectedCategory === item.name
                                    ? "font-semibold text-blue-600"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCategorySelect(item._id);
                                }}
                              >
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        )}
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}

        {/* Show More / Less */}
        {categories.length > 10 && (
          <li>
            <button
              onClick={() => setShowMore(!showMore)}
              className="w-full text-left px-2 py-1 text-blue-600 hover:underline text-sm"
            >
              {showMore ? "See Less" : "See More"}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}




