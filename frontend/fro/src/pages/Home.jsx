import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCategories } from "../redux/categorySlice";
import { fetchProducts } from "../redux/productSlice";
import ProductsSlider from "./Slider";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
  import { FaLeaf, FaTruck, FaSeedling, FaAppleAlt } from "react-icons/fa";


export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const { categories = [], selectedCategory = "All" } = useSelector(
    (state) => state.categories || {},
  );

  const {
    products = [],
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.products || {});

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory === "All") {
      dispatch(fetchProducts());
    } else {
      dispatch(fetchProducts({ category: selectedCategory }));
    }
  }, [dispatch, selectedCategory]);

  // Search suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setSuggestions(filtered.slice(0, 5));
  }, [searchTerm, products]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(fetchProducts({ search: searchTerm.trim() }));
  };

  useEffect(() => {
    if (products.length === 1 && searchTerm.trim()) {
      navigate(`/product/${products[0]._id}`);
    }
  }, [products, searchTerm, navigate]);

  if (productsLoading)
    return <div className="text-center mt-10">Loading products...</div>;

  if (productsError)
    return (
      <div className="text-center mt-10 text-red-500">{productsError}</div>
    );

  const fallbackImage = "/assets/no-image.png";

  return (
    <>
      {/* SEARCH BAR */}
      <section className="pb-10 center">
        <div className="relative max-w-5xl mx-auto px-4 pt-6 md:pt-10">
          <form onSubmit={handleSearchSubmit} className="flex mb-6 center">
            {" "}
            <input
              type="text"
              placeholder="What do you need?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="nav-input flex-grow"
            />
            <button type="submit" className="site-btn">
              SEARCH
            </button>
          </form>
          {suggestions.length > 0 && (
            <ul className="absolute z-20 bg-white border w-full mt-1 rounded shadow">
              {suggestions.map((product) => (
                <li
                  key={product._id}
                  className="p-3 cursor-pointer hover:bg-green-100"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {/* know about us */}

  <section className="w-full min-h-[500px] grid grid-cols-1 md:grid-cols-2">
  

  {/* LEFT — FULL IMAGE */}
  <motion.div
    initial={{ opacity: 0, x: -80 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="h-[350px] md:h-auto"
  >
    <img
      src="/assets/img/cht.png"
      alt="Fresh fruits and vegetables"
      className="w-full h-full object-cover"
    />
  </motion.div>

  {/* RIGHT — TEXT CONTENT */}
   <div className="section-title text-center">
          <h2>About Us</h2>
        </div>
<motion.div
  initial={{ opacity: 0, x: -80 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8 }}
>
  <h2 className="section-title text-center mb-6">
    Farm Fresh <span>Vegetables</span> & Fruits
  </h2>

  <p className="text-lg text-gray-700 leading-relaxed mb-6">
    <span className="text-green-500">🌱</span> <strong>About Us:</strong> We are a farm-to-home vegetable company committed to delivering the freshest, naturally grown produce straight from trusted local farms to your doorstep. Every vegetable and fruit is picked at peak ripeness to ensure maximum flavor and nutrients.  
    <span className="text-yellow-500 mx-1">🌿</span> Our farmers follow sustainable and eco-friendly practices, using natural fertilizers and avoiding harmful chemicals, so you get healthy and safe produce.  
    <span className="text-blue-500 mx-1">🚚</span> With fast and careful delivery, we bring farm freshness directly to your kitchen, packed securely so everything stays crisp and delicious.  
    <span className="text-red-500 mx-1">🍎</span> We believe nutritious food should be affordable and accessible to every family, making it easy to eat fresh, healthy, and delicious meals every day.
  </p>
</motion.div>
</section>







 


      {/* Featured Categories */}
      <section className="featured spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Featured Categories</h2>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            {categories.length === 0 ? (
              <div className="col-12 text-center">
                <p className="text-gray-500 text-lg">
                  No categories available.
                </p>
              </div>
            ) : (
              categories.map((cat) => (
                <div
                  key={cat._id || cat.name}
                  className="col-lg-3 col-md-4 col-sm-6 mb-6"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Link
                    to={`/category/${cat._id}`}
                    className="featured__item border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                    style={{ width: "100%", maxWidth: "300px" }}
                  >
                    <div className="featured__item__pic relative overflow-hidden rounded-t-lg">
                      <img
                        src={
                          Array.isArray(cat.images) && cat.images.length > 0
                            ? cat.images[0].startsWith("http")
                              ? cat.images[0]
                              : `${backendUrl}${
                                  cat.images[0].startsWith("/")
                                    ? cat.images[0]
                                    : "/" + cat.images[0]
                                }`
                            : fallbackImage
                        }
                        alt={cat.name || "Category"}
                        onError={(e) => (e.target.src = fallbackImage)}
                        style={{
                          width: "100%",
                          height: "250px",
                          objectFit: "cover",
                        }}
                        loading="lazy"
                      />
                    </div>
                    <div className="featured__item__text p-4 text-center">
                      <h5 className="text-xl font-bold text-black mb-2">
                        {cat.name}
                      </h5>
                      <p className="text-sm text-gray-500">
                        {cat.description?.slice(0, 50) ||
                          "Explore this category"}
                        {cat.description?.length > 50 ? "..." : ""}
                      </p>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* LATEST PRODUCTS */}
      <div className="mt-10">
        <div className="section-title text-center">
          <h2>Our Latest Deals</h2>
        </div>
        <ProductsSlider />
      </div>

      {/* Featured Products */}
      <section className="featured spad">
        <div className="container">
          {selectedCategory && (
            <>
              <div className="col-lg-12 mt-4">
                <div className="section-title text-center">
                  <h2>All Products</h2>
                </div>
              </div>

              <div className="row mt-4">
                {products.length === 0 ? (
                  <div className="col-12 text-center">
                    <p className="text-gray-500 text-lg">
                      No products available at the moment.
                    </p>
                  </div>
                ) : (
                  products.map((product) => (
                    <div
                      key={product._id}
                      className="col-lg-3 col-md-4 col-sm-6 mb-6"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <div
                        className="featured__item border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                        style={{ width: "100%", maxWidth: "300px" }}
                      >
                        <div className="featured__item__pic relative overflow-hidden rounded-t-lg">
                          <Link to={`/product/${product._id}`}>
                            <img
                              src={
                                product.images?.[0]
                                  ? product.images[0].startsWith("http")
                                    ? product.images[0]
                                    : `${backendUrl}${product.images[0]}`
                                  : fallbackImage
                              }
                              alt={product.name || "Product Image"}
                              style={{
                                width: "100%",
                                height: "250px",
                                objectFit: "cover",
                              }}
                              loading="lazy"
                            />
                          </Link>
                        </div>

                        <div className="featured__item__text p-4 text-center">
                          <h6 className="text-lg font-medium text-gray-800 mb-1">
                            <Link
                              to={`/product/${product._id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {product.name}
                            </Link>
                          </h6>
                          <h5 className="text-xl font-bold text-gray-900">
                            ₹{product.price?.toFixed(2)}
                          </h5>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </section>

    

      {/* Blog Section */}
      <section className="from-blog spad">
        <div className="container">
          <div className="row">
            {["blog-1.jpg", "blog-2.jpg", "blog-3.jpg"].map((img, index) => (
              <div key={index} className="col-lg-4 col-md-4 col-sm-6">
                <div className="blog__item">
                  <div className="blog__item__pic">
                    <img src={`/assets/${img}`} alt="" />
                  </div>
                  <div className="blog__item__text">
                    <ul>
                      <li>
                        <i className="fa fa-calendar-o"></i> May 4, 2019
                      </li>
                      <li>
                        <i className="fa fa-comment-o"></i> 5
                      </li>
                    </ul>
                    <h5>
                      <a href="#">
                        {index === 0
                          ? "Cooking tips make cooking simple"
                          : index === 1
                          ? "6 ways to prepare breakfast for 30"
                          : "Visit the clean farm in the US"}
                      </a>
                    </h5>
                    <p>
                      Sed quia non numquam modi tempora indunt ut labore et
                      dolore magnam aliquam quaerat.
                    </p>
                  </div>
                </div>
              </div>
            ))}
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
                      src="/assets/img/logo.png" 
                      alt="Logo"
                      style={{ width: "45px", height: "auto" }}
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
