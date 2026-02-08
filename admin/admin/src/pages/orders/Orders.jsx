


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaComments, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const token = localStorage.getItem("token");

  const [previewImage, setPreviewImage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  /* ================= FETCH ADMIN ORDERS ================= */
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/order/admin-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setOrders(data.orders || []);
        setFilteredOrders(data.orders || []);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ORDER ================= */
  const deleteOrder = async () => {
    if (!deleteId) return;

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/remove`,
        { id: deleteId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        toast.success("Deleted successfully");
        fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Error deleting order");
    }

    setDeleteId(null);
  };

  /* ================= SEARCH ================= */
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = orders.filter((o) => {
      const user = o.userId?.name?.toLowerCase() || "";
      const product = o.productId?.name?.toLowerCase() || "";
      const date = new Date(o.createdAt).toLocaleDateString().toLowerCase();
      const country = o.country?.toLowerCase() || "";

      return (
        user.includes(term) ||
        product.includes(term) ||
        date.includes(term) ||
        country.includes(term)
      );
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, orders]);

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const currentItems = filteredOrders.slice(
    indexOfLast - itemsPerPage,
    indexOfLast
  );

  const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    <>
      <p className="mb-2 font-semibold text-lg">All User Requests</p>

      <input
        type="text"
        placeholder="Search by user, product, date..."
        className="form-control mb-4 p-3 shadow-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2 text-muted">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr] bg-gray-100 p-2 text-sm font-semibold">
            <span>User</span>
            <span>Product</span>
            
            <span>Date</span>
            <span className="text-center">Action</span>
          </div>

          {currentItems.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-[1fr_3fr] md:grid-cols-[1fr_3fr_1fr_1fr] gap-4 p-2 border text-sm"
            >
              <div>
                <p className="font-semibold">{item.userId?.name}</p>
                <p className="text-xs text-gray-500">
                  {item.userId?.email}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={
                    item.productId?.images?.[0]
                      ? backendUrl + item.productId.images[0]
                      : item.productId?.image
                      ? backendUrl + item.productId.image
                      : item.productId?.img
                      ? backendUrl + item.productId.img
                      : "https://via.placeholder.com/80"
                  }
                  className="w-16 h-16 rounded object-cover border cursor-pointer"
                  onClick={() =>
                    setPreviewImage(
                      backendUrl +
                        (item.productId?.images?.[0] ||
                          item.productId?.image ||
                          item.productId?.img)
                    )
                  }
                />
                <p className="font-semibold">{item.productId?.name}</p>
                
              </div>
            
              <p className="text-center">{formatDate(item.createdAt)}</p>

              <div className="flex justify-center gap-4 text-lg">
                {/* <FaComments className="text-blue-600 cursor-pointer" /> */}
                <FaTrash
                  className="text-red-600 cursor-pointer"
                  onClick={() => setDeleteId(item._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded">
            <FaTimes
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setPreviewImage(null)}
            />
            <img
              src={previewImage}
              className="max-w-[90vw] max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded text-center">
            <p className="mb-4 font-semibold">
              Are you sure you want to delete?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={deleteOrder}
              >
                Delete
              </button>
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
