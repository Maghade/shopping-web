




// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";

// export default function ProductsSlider() {
//   // 🔹 Get products from Redux
//   const { products = [], loading, error } = useSelector(
//     (state) => state.products || {}
//   );

//   if (loading) {
//     return <div className="text-center py-10 text-gray-500">Loading products...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-red-500">Error: {error}</div>;
//   }

//   if (!products.length) {
//     return <div className="text-center py-10 text-gray-800">No products available.</div>;
//   }

//   return (
//     <section className="products my-10">
//       <div className="container mx-auto">
//         <Swiper
//           modules={[Navigation, Autoplay]}
//           navigation
//           autoplay={{ delay: 2500, disableOnInteraction: false }}
//           loop
//           spaceBetween={20}
//           breakpoints={{
//             0: { slidesPerView: 1 },
//             480: { slidesPerView: 2 },
//             768: { slidesPerView: 3 },
//             1024: { slidesPerView: 4 },
//           }}
//           className="w-full"
//         >
//           {products.map((product) => (
//             <SwiperSlide key={product._id}>
//               <div className="rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col bg-white">
//                 {/* 🖼 Product Image */}
//                 <Link to={`/product/${product._id}`}>
//                   <img
//                     src={
//                       product.images?.[0] ||
//                       "https://picsum.photos/500/500?random=product1"
//                     }
//                     alt={product.name || "Product"}
//                     onError={(e) =>
//                       (e.target.src = "https://picsum.photos/500/500?random=product2")
//                     }
//                     className="w-full h-48 object-cover"
//                   />
//                 </Link>

//                 {/* 📄 Product Info */}
//                 <div className="p-3 text-center ">
//                   <h5 className="text-lg font-medium text-gray-800">
//                     <Link
//                       to={`/product/${product._id}`}
//                       className="product_name"
//                     >
//                       {product.name}
//                     </Link>
//                   </h5>
//                   <p className="text-green-600 font-semibold">
//                     ₹{product.price?.toFixed(2)}
//                   </p>
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// }


import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const fallbackImage = "https://picsum.photos/500/500?random=product";

export default function ProductsSlider() {
  const { products = [], loading, error } = useSelector(
    (state) => state.products || {}
  );

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">
        Loading products...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500">Error: {error}</div>
    );

  if (!products.length)
    return (
      <div className="text-center py-10 text-gray-800">
        No products available.
      </div>
    );

  return (
    <section className="products my-10">
      <div className="container mx-auto">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="w-full"
        >
          {products.map((product) => {
            const imageUrl = product.images?.[0]
              ? product.images[0].startsWith("http")
                ? product.images[0]
                : `${backendUrl}${product.images[0]}`
              : fallbackImage;

            return (
              <SwiperSlide key={product._id}>
                <div
                  className="flex flex-col bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300"
                  style={{
                    width: "100%",
                    height: "360px", // uniform height for all cards
                  }}
                >
                  {/* Product Image */}
                  <Link to={`/product/${product._id}`}>
                    <div
                      style={{
                        width: "100%",
                        height: "220px", // uniform image height
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={product.name || "Product"}
                        onError={(e) => (e.target.src = fallbackImage)}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover", // ensures image scales proportionally
                        }}
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-center items-center p-4 text-center">
                    <h5 className="text-base font-semibold text-gray-800 mb-1 truncate w-full">
                      <Link
                        to={`/product/${product._id}`}
                        className="hover:text-green-600 transition-colors"
                      >
                        {product.name}
                      </Link>
                    </h5>
                    <p className="text-green-600 font-semibold text-lg">
                      ₹{product.price?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
