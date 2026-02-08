


import { useParams } from "react-router-dom";
import ProductDetail from "./ProductDetails";

export default function ProductList() {


  // Create an array with 8 placeholders
  const items = Array.from({ length:1 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {items.map((_, index) => (
        <ProductDetail key={index} />
      ))}
    </div>
  );
}


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// export default function ProductList() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/products`);
//         setProducts(data);
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load products.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading)
//     return (
//       <div className="text-center mt-20 text-gray-500 text-lg">
//         Loading products...
//       </div>
//     );

//   if (!products.length)
//     return (
//       <div className="text-center mt-20 text-gray-500 text-lg">
//         No products found.
//       </div>
//     );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Products</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map((product) => {
//           const imageUrl =
//             product.images?.[0]?.startsWith("http")
//               ? product.images[0]
//               : product.images?.[0]
//               ? `${backendUrl}${product.images[0]}`
//               : "";

//           return (
//             <div
//               key={product._id}
//               className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
//             >
//               {imageUrl ? (
//                 <img
//                   src={imageUrl}
//                   alt={product.name}
//                   className="w-full h-48 object-cover"
//                 />
//               ) : (
//                 <div className="w-full h-48 flex items-center justify-center bg-gray-100 text-gray-400">
//                   No Image
//                 </div>
//               )}

//               <div className="p-4">
//                 <h2 className="text-lg font-semibold text-gray-800 mb-1">
//                   {product.name}
//                 </h2>
//                 <p className="text-red-600 font-bold mb-1">
//                   ₹ {product.price?.toFixed(2) || "N/A"} / {product.unit || "unit"}
//                 </p>
//                 <p className="text-gray-500 text-sm">
//                   MOQ: {product.moq || "Not specified"} {product.unit || "units"}
//                 </p>
//                 <button className="mt-3 w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700 transition">
//                   View Details
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <ToastContainer position="top-center" autoClose={2000} />
//     </div>
//   );
// }