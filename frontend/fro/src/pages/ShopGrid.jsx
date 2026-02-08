




import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchCategories,
  setCategory as setCategoryAction,
  setSubCategory as setSubCategoryAction,
} from "../redux/categorySlice";
import { fetchProducts } from "../redux/productSlice";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ShopGrid() {
  const dispatch = useDispatch();

  const { products = [], loading: productsLoading } = useSelector(
    (state) => state.products || {}
  );

  const {
    categories = [],
    selectedCategory = "All",
    selectedSubCategory = "",
  } = useSelector((state) => state.categories || {});

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // ✅ Load only categories on first load
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

 useEffect(() => {
  const params = {};

  // ✅ If category is "All", fetch ALL products
  if (selectedCategory === "All") {
    dispatch(fetchProducts({}));
    return;
  }

  // ✅ If a category is selected (NOT "All")
  params.category = selectedCategory;

  // ✅ If subcategory is selected
  if (selectedSubCategory) {
    params.subCategory = selectedSubCategory;
  }

  dispatch(fetchProducts(params));
}, [dispatch, selectedCategory, selectedSubCategory]);


  // ✅ Apply price filter only on already-loaded products
  useEffect(() => {
    let result = [...products];
    result = result.filter(
      (p) => p.price !== undefined && p.price >= minPrice && p.price <= maxPrice
    );
    setFilteredProducts(result);
  }, [minPrice, maxPrice, products]);

  // ✅ Get selected category object for showing subcategories
  const selectedCatObj =
    categories.find((cat) => cat._id === selectedCategory) || null;

  const fallbackImage =
    "https://via.placeholder.com/300x300.png?text=No+Image";

  return (
    <>
      {/* Product Section */}
      <section className="shop spad">
        <div className="container">
          <div className="row">
            
            {/* Sidebar */}
            <div className="col-lg-3 col-md-5">
              <div className="sidebar">
                {/* Categories */}
                <div className="sidebar__item">
                  <h4 className="font-semibold text-lg mb-3">Categories</h4>

                  <ul className="space-y-1">
                    <li>
                      <a
                        href="#"
                        className={`block text-sm ${
                          selectedCategory === "All"
                            ? "font-bold underline"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(setCategoryAction("All"));
                          dispatch(setSubCategoryAction(""));
                        }}
                      >
                        All
                      </a>
                    </li>

                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <a
                          href="#"
                          className={`block text-sm ${
                            selectedCategory === cat._id
                              ? "font-bold underline"
                              : "text-gray-700 hover:text-green-900"
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(setCategoryAction(cat._id));
                            dispatch(setSubCategoryAction(""));
                          }}
                        >
                          {cat.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subcategories */}
                {selectedCatObj &&
                  selectedCatObj.subcategories?.length > 0 && (
                    <div className="sidebar__item mt-6">
                      <h4 className="font-semibold text-lg mb-3">
                        Subcategories
                      </h4>

                      {/* All subcategories */}
                      <div
                        className={`flex items-center mb-2 p-2 rounded-md ${
                          !selectedSubCategory
                            ? "bg-blue-50 border-l-4 border-blue-500"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => dispatch(setSubCategoryAction(""))}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                            !selectedSubCategory
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {!selectedSubCategory && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm">All</span>
                      </div>

                      {/* Individual subcategories */}
                    <ul className="space-y-2">
  {selectedCatObj.subcategories.map((subcat) => (
    <a href="#"
      key={subcat._id}
      onClick={() => {
        dispatch(setSubCategoryAction(subcat._id));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`flex items-center p-2 rounded-md cursor-pointer text-gray-700 hover:text-gray-900
      ${
        selectedSubCategory === subcat._id
          ? ""
          // "border-l-4 border-blue-500"
          : "hover:bg-gray-100"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
        ${
          selectedSubCategory === subcat._id
            ? "border-blue-500 bg-blue-500"
            : "border-gray-300"
        }`}
      >
        {selectedSubCategory === subcat._id && (
          <div className="w-2 h-2 bg-white rounded-full"></div>
        )}
      </div>

      {/* ✅ cursor-pointer added here — FIX */}
      <span className="text-sm cursor-pointer">{subcat.name}</span>
    </a>
  ))}
</ul>

                    </div>
                  )}

                {/* Price Filter */}
                <div className="sidebar__item mt-6">
                  <h4 className="font-semibold text-lg mb-3">Price Range</h4>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      className="border p-2 rounded w-20"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="border p-2 rounded w-20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9 col-md-7">
              <div className="row">
                {productsLoading ? (
                  <div className="col-12 text-center py-8">
                    <p>Loading products...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-12 text-center py-8">
                    <p>No products found.</p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="col-lg-4 col-md-6 col-sm-6 mb-4"
                    >
                      <div className="featured__item border rounded-lg shadow-sm hover:shadow-lg transition">
                        <div className="featured__item__pic">
                          <Link to={`/product/${product._id}`}>
                            <img
                              src={
                                product.images?.[0]
                                  ? product.images[0].startsWith("http")
                                    ? product.images[0]
                                    : `${backendUrl}${product.images[0]}`
                                  : fallbackImage
                              }
                              alt={product.name}
                              style={{
                                width: "100%",
                                height: "250px",
                                objectFit: "cover",
                              }}
                            />
                          </Link>
                        </div>

                        <div className="featured__item__text text-center p-3">
                          <h6 className="mb-1">{product.name}</h6>
                          <h5>₹{product.price?.toFixed(2)}</h5>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer Section */}
       <footer className="footer spad">
              <div className="container">
                <div className="row">
                  <div className="col-lg-3 col-md-6 col-sm-6">
                    <div className="footer__about">
                      <div className="footer__about__logo">
                        <Link to="/">
                          <img
                            src="/assets/img/63ff4e0e-a6e2-42c7-b38b-c09eae653033.jpg"
                            alt="Logo"
                            style={{ width: "75px", height: "auto" }}
                          />
                        </Link>
                      </div>
                      <ul>
                        <li>
                          Address:Plot No. 11, Near Cid State HQ Behind Police Line
                          Takli, Nagpur-440013, Maharashtra, India
                        </li>
                        <li>Phone: + 07949224873</li>
                        <li>Email: sfkgroup.16@gmail</li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
                    <div className="footer__widget">
                      <h6>Useful Links</h6>
                      <ul>
                        <li>
                          <a href="#">About Us</a>
                        </li>
                        <li>
                          <a href="#">About Our Shop</a>
                        </li>
                        <li>
                          <a href="#">Secure Shopping</a>
                        </li>
                        <li>
                          <a href="#">Delivery information</a>
                        </li>
                        <li>
                          <a href="#">Privacy Policy</a>
                        </li>
                        <li>
                          <a href="#">Our Sitemap</a>
                        </li>
                      </ul>
                      <ul>
                        <li>
                          <a href="#">Who We Are</a>
                        </li>
                        <li>
                          <a href="#">Our Services</a>
                        </li>
                        <li>
                          <a href="#">Projects</a>
                        </li>
                        <li>
                          <a href="#">Contact</a>
                        </li>
                        <li>
                          <a href="#">Innovation</a>
                        </li>
                        <li>
                          <a href="#">Testimonials</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-12">
                    <div className="footer__widget">
                      <h6>Join Our Newsletter Now</h6>
                      <p>
                        Get E-mail updates about our latest shop and special offers.
                      </p>
                      <form action="#">
                        <input type="text" placeholder="Enter your mail" />
                        <button type="submit" className="site-btn">
                          Subscribe
                        </button>
                      </form>
                      <div className="footer__widget__social">
                        <a
                          href="https://www.facebook.com/sharer.php?u=https://www.indiamart.com/sfk-group/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fa fa-facebook"></i>
                        </a>
                        <a href="#">
                          <i className="fa fa-instagram"></i>
                        </a>
                        <a href="#">
                          <i className="fa fa-twitter"></i>
                        </a>
                        <a href="#">
                          <i className="fa fa-pinterest"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="footer__copyright"></div>
                  </div>
                </div>
              </div>
            </footer>
      
    </>
  );
}
