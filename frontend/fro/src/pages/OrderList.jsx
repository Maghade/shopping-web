
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaComments, FaTrash, FaBox } from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const itemsPerPage = 5;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // ---------------- fetch orders ----------------
  useEffect(() => {
    fetchOrders();
 return () => {   
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setOrders([...(data.orders || []), ...(data.requests || [])]);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching orders");
    }
    setLoading(false);
  };

  // ---------------- delete ----------------
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/order/remove`,
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Deleted successfully");
        fetchOrders();
      } else toast.error(data.message);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting");
    }
  };

  // Helper: scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  // ---------------- pagination ----------------
  const totalPages = Math.max(1, Math.ceil(orders.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  // ---------------- UI / render ----------------
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold text-dark">Your Orders & Requests</h3>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <p className="mt-2 text-muted">Loading data...</p>
        </div>
      ) : (
        <div className="card shadow-sm rounded-3">
          <div className="card-body p-0">
            {orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th></th>
                      <th>Date</th>
                      <th>Product</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentItems.map((order) => (
                      <tr key={order._id}>
                        <td>
                          {order.type === "Order" && (
                            <span className="badge bg-primary px-3 py-2">
                              <FaBox className="me-1" /> Order
                            </span>
                          )}
                        </td>
                        <td>
                          {order.date
                            ? new Date(order.date).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="fw-semibold">
                          {order.productName ||
                            order.items?.[0]?.ProductName ||
                            "—"}
                        </td>

                        <td className="text-center">
                          <FaTrash
                            className="text-danger fs-5"
                            style={{ cursor: "pointer" }}
                            title="Delete"
                            onClick={() => handleDelete(order._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png"
                  alt="No data"
                  width="120"
                  className="mb-3 opacity-50"
                />
                <h5 className="fw-bold text-muted">No Orders or Requests</h5>
                <p className="text-muted">
                  Start exploring products and show your interest!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded ${
              currentPage === index + 1 ? "bg-gray-300" : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>


    </div>
  );
}
