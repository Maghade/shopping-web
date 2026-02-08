import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearToken } from "../redux/authSlice";
import { setCategory as setCategoryAction } from "../redux/categorySlice";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { token } = useSelector((state) => state.auth); // ✅ read token from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
  const [categories, setCategories] = useState([]);
  const [showAllCategories, setShowAllCategories] = useState(false);



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/category/list`,
        );
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(clearToken()); // ✅ clear token in Redux
    localStorage.removeItem("token"); // remove from localStorage
    navigate("/login"); // redirect
  };

  return (
    <header className="header">
      {/* 🔹 Top bar */}
      <div className="header__top">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="header__top__left">
                <ul className="horizontal-list">
                  <li>
                    <i className="fa fa-envelope"></i> maghade@gmail.com
                  </li>
                  <li>
                    <i className="fa fa-phone"></i> +91 123 456 7890
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="header__top__right">
                <div className="header__top__right__social">
                  <a href="#">
                    <i className="">Ratings</i>
                  </a>
                  <a href="#">
                    <div className="flex items-center gap-1">
                      ⭐⭐⭐⭐⭐ <span className="font-medium"></span>
                    </div>
                  </a>
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
                
                </div>
                <div className="header__top__right__auth">
                  {token ? (
                    <span onClick={handleLogout} style={{ cursor: "pointer" }}>
                      <i className="fa fa-user"></i> Logout
                    </span>
                  ) : (
                    <Link to="/login">
                      <i className="fa fa-user"></i> Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Main Nav */}
      <div className="container">
        <div className="row items-center">
          <div className="col-lg-3 col-6">
            <div className="header__logo">
              <Link to="/">
                <img
                  src="/assets/img/veglogo.png"
                  style={{ width: "130px", height: "auto" }}
                />
              </Link>
            </div>
          </div>

          <div className="col-lg-9 hidden md:block">
            <nav className="header__menu">
              <ul>
                <li className="active">
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/shop-grid">Shop</Link>
                </li>

                <li>
                  <Link to="/Orders">Orders</Link>
                </li>

                <li>
                  <Link to="/chats">Chats</Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* 🔹 Hamburger Button (Mobile) */}
          <div className="humberger__open md:hidden" onClick={toggleMobileMenu}>
            <i className="fa fa-bars"></i>
          </div>
        </div>
      </div>

      {/* 🔹 Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile__menu fixed inset-0 bg-black/70 z-50">
          <div className="bg-white w-64 h-full p-6 relative">
            <button
              onClick={toggleMobileMenu}
              className="absolute top-4 right-4 text-xl"
            >
              ✕
            </button>
            <ul className="flex flex-col gap-4 mt-8">
              <li>
                <Link to="/" onClick={toggleMobileMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop-grid" onClick={toggleMobileMenu}>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/blog" onClick={toggleMobileMenu}>
                  Blog
                </Link>
              </li>

              <li>
                <Link to="/chats" onClick={toggleMobileMenu}>
                  Chats
                </Link>
              </li>

              {token ? (
                <li
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </li>
              ) : (
                <li>
                  <Link to="/login" onClick={toggleMobileMenu}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
