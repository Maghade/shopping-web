import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendRequest } from "../redux/requestSlice";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ProductDetails({ product: propProduct, related = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth || {});
  const { categories = [] } = useSelector((state) => state.categories || {});
  const [selectedCatObj, setSelectedCatObj] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
    const [size, setSize] = useState("");
  const singleProduct = useSelector((state) => state.products.singleProduct);


  const { products = [], loading } = useSelector(
    (state) => state.products || {}
  );
  const product = propProduct ||
    products.find((p) => p._id === id) || {
      _id: id,
      name: "Sample Product",
      description: "No product data found.",
      price: 0,
    };
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0]
      ? product.images[0].startsWith("http")
        ? product.images[0]
        : `${backendUrl}${product.images[0]}`
      : ""
  );

  const handleInterestClick = async () => {
    if (!token) {
      toast.info("Please log in to continue.");
      setTimeout(() => {
        navigate(`/login?redirect=/product/${product._id}`);
      }, 1000);
      return;
    }
if (!size) {
  toast.error("Please select a size");
  return;
}
    try {
      await dispatch(
        sendRequest({
          userId: user?._id,
          productId: product._id,
            size: size,   // 👈 ADD THIS

          message: `User is interested in ${product.name}`,
        })
      ).unwrap();

      toast.success("Your request has been received! We will get back to you shortly.");
      setTimeout(() => navigate("/orders"), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request. Try again.");
    }
  };
  const handleThumbnailClick = (img) => {
    const imageUrl = img.startsWith("http") ? img : `${backendUrl}${img}`;
    setSelectedImage(imageUrl);
  };

  // ✅ Fix: togglePopup (for main image popup)
  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
    setIsMaximized(false);
  };

  const toggleSize = () => setIsMaximized((prev) => !prev);


 
  // --- Styles remain unchanged ---
  const containerStyle = {
    maxWidth: "1200px",
    margin: "20px auto",
    padding: "20px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  };

  const productMainStyle = {
    display: "flex",
    gap: "20px",
    marginBottom: "20px",
    flexWrap: "wrap",
  };
  const imageGalleryStyle = {
    flex: "1",
    minWidth: "300px",
    border: "1px solid #eee",
    padding: "10px",
    borderRadius: "8px",
  };
  const thumbnailListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "10px",
  };
  const thumbnailImgStyle = {
    width: "100px",
    height: "80px",
    objectFit: "cover",
    border: "1px solid #ccc",
    cursor: "pointer",
    borderRadius: "4px",
  };
  const mainImageContainerStyle = { marginTop: "10px", position: "relative" };
  const mainImageStyle = {
    width: "100%",
    height: "400px",
    objectFit: "contain",
    borderRadius: "8px",
    border: "1px solid #eee",
    backgroundColor: "#fafafa",
    cursor: "pointer",
  };
  const getMorePhotosBtnStyle = {
    marginTop: "10px",
    padding: "8px 16px",
    border: "2px solid #007B8E",
    borderRadius: "20px",
    color: "#007B8E",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };
  const productDetailsStyle = {
    flex: "1",
    minWidth: "300px",
    padding: "0 20px",
  };
  const titleStyle = {
    margin: "0 0 10px",
    color: "#333",
    fontSize: "28px",
    fontWeight: "bold",
  };
  const priceInfoStyle = {
    margin: "0 0 10px",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#d32f2f",
  };
  const latestPriceLinkStyle = {
    color: "#007B8E",
    textDecoration: "underline",
    marginLeft: "10px",
    fontSize: "16px",
  };
  const descriptionStyle = {
    lineHeight: "1.6",
    margin: "15px 0",
    fontSize: "16px",
    color: "#555",
    wordWrap: "break-word",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
  };

  const additionalInfoStyle = { margin: "20px 0" };
  const additionalInfoTitleStyle = {
    fontSize: "18px",
    margin: "0 0 10px",
    color: "#333",
  };
  const additionalInfoListStyle = { paddingLeft: "20px", margin: "5px 0" };
  const interestBtnStyle = {
    marginTop: "20px",
    padding: "14px 30px",
    backgroundColor: "#007B8E",
    color: "black",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  return (
    <div style={containerStyle}>
      <div style={productMainStyle}>
        {/* 🖼️ Image Gallery */}

        <div style={imageGalleryStyle}>
          <div style={thumbnailListStyle}>
            {product.images?.length > 0 ? (
              product.images.map((img, idx) => {
                // ✅ Build full backend image URL
                const imageUrl = img.startsWith("http")
                  ? img
                  : `${backendUrl}${img}`;

                return (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    key={idx}
                    src={imageUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    style={{
                      ...thumbnailImgStyle,
                      border:
                        selectedImage === imageUrl
                          ? "2px solid #007B8E"
                          : "1px solid #ccc",
                    }}
                    onClick={() => handleThumbnailClick(imageUrl)}
                  />
                );
              })
            ) : (
              <div>No images available</div>
            )}
          </div>

          <div style={mainImageContainerStyle}>
            {selectedImage ? (
              <motion.img
                src={selectedImage}
                alt="Main Product"
                style={mainImageStyle}
                onClick={togglePopup}
                whileHover={{ scale: 1.02 }}
              />
            ) : (
              <div
                style={{
                  ...mainImageStyle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#888",
                }}
              >
                No image selected
              </div>
            )}
            <button style={getMorePhotosBtnStyle}>📸 Get More Photos</button>
          </div>
        </div>

        {/* 🛍️ Product Info */}
        <div style={{ flex: 1, minWidth: "300px", padding: "0 16px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#1f2937", // gray-800
              marginBottom: "8px",
            }}
          >
            {product.name || "Product Name"}
          </h1>

          <p
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "#dc2626", // red-600
              marginBottom: "12px",
            }}
          >
            ₹ {product.price ? product.price.toFixed(2) : "N/A"} /{" "}
            {product.unit || "Unit"}
            <a
              href="#"
              style={{
                marginLeft: "8px",
                color: "#0d9488", // teal-600
                textDecoration: "underline",
                fontSize: "16px",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#0f766e")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#0d9488")}
            >
              Get Latest Price
            </a>
          </p>

          <p style={{ marginBottom: "16px", color: "#374151" }}>
            <strong>Minimum Order Quantity:</strong>{" "}
            {product.moq || "Not specified"} {product.unit || "units"}
          </p>

          <div
            style={descriptionStyle}
            dangerouslySetInnerHTML={{
              __html: product.description || "<p>No description available.</p>",
            }}
          />
   <div style={{ marginTop: "16px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#1f2937",
                marginBottom: "8px",
              }}
            >
              Additional Information
            </h3>
  <div className="flex gap-6">
    {["Small", "Medium", "Large"].map((s) => (
      <label key={s} className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="size"
          value={s}
          checked={size === s}
          onChange={(e) => setSize(e.target.value)}
          className="accent-purple-600"
        />
        {s}
      </label>
    ))}
  </div>
            <ul
              style={{
                listStyleType: "disc",
                paddingLeft: "20px",
                color: "#374151",
                lineHeight: "1.6",
              }}
            >
              
             {/* <li>
                <strong>Size:</strong> {product.size || "N/A"}
              </li>  */}
            
              <li>
                <strong>Category:</strong>{" "}
                {product.category?.name || product.categoryName || "N/A"}
              </li>
              <li>
                <strong>Subcategory:</strong>{" "}
                {product.subCategories && product.subCategories.length > 0
                  ? product.subCategories.map((sub) => sub.name).join(", ")
                  : "N/A"}
              </li>

              {product.customFields && product.customFields.length > 0 ? (
                product.customFields.map((field) => (
                  <li key={field._id}>
                    <strong>{field.label}:</strong> {field.value}
                  </li>
                ))
              ) : (
                <li>No additional details available</li>
              )}
            </ul>
          </div>
          <button
            onClick={handleInterestClick}
            style={{
              marginTop: "24px",
              padding: "12px 32px",
              backgroundColor: "#0d9488", // teal-600
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "18px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#0f766e")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#0d9488")
            }
          >
           Add To Cart
          </button>
        </div>
      </div>

      {/* 🪟 Animated Image Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={togglePopup}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ position: "relative", textAlign: "center" }}
            >
              <button
                onClick={togglePopup}
                title="Close"
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "0",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                ✕
              </button>

              <button
                onClick={toggleSize}
                title={isMaximized ? "Minimize" : "Maximize"}
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "50px",
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid #ccc",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                {isMaximized ? "–" : "+"}
              </button>

              <motion.img
                src={selectedImage}
                alt={product.name}
                animate={{
                  maxWidth: isMaximized ? "90vw" : "60vw",
                  maxHeight: isMaximized ? "85vh" : "60vh",
                }}
                transition={{ duration: 0.3 }}
                style={{
                  borderRadius: "8px",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}




// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { motion, AnimatePresence } from "framer-motion";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { sendRequest } from "../redux/requestSlice";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// export default function ProductDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { token, user } = useSelector((state) => state.auth || {});

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [isMaximized, setIsMaximized] = useState(false);

//   // ✅ Fetch product from API
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/products/${id}`);
//         setProduct(data);
//         setSelectedImage(
//           data.images?.[0]
//             ? data.images[0].startsWith("http")
//               ? data.images[0]
//               : `${backendUrl}${data.images[0]}`
//             : ""
//         );
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load product.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   const handleThumbnailClick = (img) => {
//     const imageUrl = img.startsWith("http") ? img : `${backendUrl}${img}`;
//     setSelectedImage(imageUrl);
//   };

//   const togglePopup = () => {
//     setIsPopupOpen((prev) => !prev);
//     setIsMaximized(false);
//   };

//   const toggleSize = () => setIsMaximized((prev) => !prev);

//   const handleInterestClick = async () => {
//     if (!token) {
//       toast.info("Please log in to continue.");
//       setTimeout(() => navigate(`/login?redirect=/product/${id}`), 1000);
//       return;
//     }

//     try {
//       await dispatch(
//         sendRequest({
//           userId: user?._id,
//           productId: product._id,
//           message: `User is interested in ${product.name}`,
//         })
//       ).unwrap();

//       toast.success("Your request has been received! We will get back to you shortly.");
//       setTimeout(() => navigate("/orders"), 2000);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to send request. Try again.");
//     }
//   };

//   if (loading) return <div className="text-center mt-20">Loading product...</div>;
//   if (!product) return <div className="text-center mt-20 text-red-500">Product not found.</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
//       <div className="flex flex-wrap gap-6">
//         {/* Images */}
//         <div className="flex-1 min-w-[300px] border p-4 rounded-lg">
//           <div className="flex flex-col gap-4 mb-4">
//             {product.images?.map((img, idx) => {
//               const url = img.startsWith("http") ? img : `${backendUrl}${img}`;
//               return (
//                 <motion.img
//                   key={idx}
//                   src={url}
//                   alt={`Thumbnail ${idx}`}
//                   className={`w-24 h-20 object-cover cursor-pointer rounded border ${
//                     selectedImage === url ? "border-teal-600" : "border-gray-300"
//                   }`}
//                   whileHover={{ scale: 1.05 }}
//                   onClick={() => handleThumbnailClick(url)}
//                 />
//               );
//             })}
//           </div>
//           <div className="relative">
//             {selectedImage ? (
//               <motion.img
//                 src={selectedImage}
//                 alt={product.name}
//                 className="w-full h-96 object-contain cursor-pointer rounded border border-gray-200 bg-gray-50"
//                 onClick={togglePopup}
//                 whileHover={{ scale: 1.02 }}
//               />
//             ) : (
//               <div className="w-full h-96 flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-500">
//                 No image available
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="flex-1 min-w-[300px] p-2">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
//           <p className="text-2xl font-semibold text-red-600 mb-2">
//             ₹ {product.price} / {product.unit || "unit"}
//           </p>
//           <p className="text-gray-600 mb-4">
//             <strong>Minimum Order:</strong> {product.moq || 1} {product.unit || "units"}
//           </p>

//           <div
//             className="text-gray-700 mb-4"
//             dangerouslySetInnerHTML={{ __html: product.description || "<p>No description</p>" }}
//           />

//           <div className="mb-4">
//             <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Information</h3>
//             <ul className="list-disc list-inside text-gray-700">
//               <li><strong>Brand:</strong> {product.brand || "N/A"}</li>
//               <li><strong>Manufacturer:</strong> {product.manufacturer || "N/A"}</li>
//               <li><strong>Packing:</strong> {product.packing || "N/A"}</li>
//               <li><strong>Country of Origin:</strong> {product.countryOfOrigin || "N/A"}</li>
//               <li><strong>Strength:</strong> {product.strength || "N/A"}</li>
//               <li><strong>Usage/Application:</strong> {product.usageApplication || "N/A"}</li>
//               <li><strong>Category:</strong> {product.category?.name || "N/A"}</li>
//               <li>
//                 <strong>Subcategory:</strong>{" "}
//                 {product.subCategories?.length > 0 ? product.subCategories.map(s => s.name).join(", ") : "N/A"}
//               </li>
//               {product.customFields?.length > 0
//                 ? product.customFields.map(f => (
//                     <li key={f._id}><strong>{f.label}:</strong> {f.value}</li>
//                   ))
//                 : null}
//             </ul>
//           </div>

//           <button
//             onClick={handleInterestClick}
//             className="px-6 py-3 bg-teal-600 text-white font-semibold rounded hover:bg-teal-700 transition"
//           >
//             Yes, I am interested!
//           </button>
//         </div>
//       </div>

//       {/* Popup Image */}
//       <AnimatePresence>
//         {isPopupOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
//             onClick={togglePopup}
//           >
//             <motion.div
//               onClick={(e) => e.stopPropagation()}
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               className="relative text-center"
//             >
//               <button
//                 onClick={togglePopup}
//                 className="absolute top-[-40px] right-0 bg-white rounded-full w-8 h-8 text-lg font-bold"
//               >
//                 ✕
//               </button>
//               <button
//                 onClick={toggleSize}
//                 className="absolute top-[-40px] right-14 bg-white rounded-full w-8 h-8 text-lg font-bold"
//               >
//                 {isMaximized ? "–" : "+"}
//               </button>
//               <motion.img
//                 src={selectedImage}
//                 alt={product.name}
//                 animate={{ maxWidth: isMaximized ? "90vw" : "60vw", maxHeight: isMaximized ? "85vh" : "60vh" }}
//                 transition={{ duration: 0.3 }}
//                 className="rounded"
//               />
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <ToastContainer position="top-center" autoClose={2000} />
//     </div>
//   );
// }