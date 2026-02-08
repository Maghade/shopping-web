// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductList";
import Blog from "./pages/Blog";
// import BlogDetails from "./pages/BlogDetails";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Main from "./pages/Main";
import ShopDetails from "./pages/ShopDetails";
import ShopGrid from "./pages/ShopGrid";
import ShopingCart from "./pages/ShopingCart";
import Login from "./components/Login";

import CategoryPage from "./pages/CategoryPage";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VerifyEmail from "./pages/Mail";
import ForgotPassword from "./components/Forget";
import ResetPassword from "./components/ResetPassword";
import OrderList from "./pages/OrderList";
import Gallery from "./pages/Gallery";
import Chats from "./pages/Chats";
export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />

          {/* ✅ All these pages are now PUBLIC */}
          <Route path="/blog" element={<Blog />} />
          {/* <Route path="/blog-details" element={<BlogDetails />} /> */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/main" element={<Main />} />
          <Route path="/shop-details" element={<ShopDetails />} />
          <Route path="/shop-grid" element={<ShopGrid />} />
          <Route path="/shoping-cart" element={<ShopingCart />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/gallery" element={<Gallery />} />
<Route path="/chats" element={<Chats />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
