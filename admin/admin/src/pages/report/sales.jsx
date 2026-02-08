


import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchSales = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/report/sales`);
      if (Array.isArray(response.data)) {
        setSales(response.data);
        setFilteredSales(response.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch sales data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Filter by month and user search
  useEffect(() => {
    let filtered = sales;

    if (selectedMonth) {
      filtered = filtered.filter((sale) => {
        const saleMonth = new Date(sale.orderDate).getMonth() + 1;
        return saleMonth === parseInt(selectedMonth, 10);
      });
    }

    if (searchUser.trim()) {
      filtered = filtered.filter((sale) =>
        sale.customerName.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    setFilteredSales(filtered);
    setCurrentPage(1); // Reset to first page on filter
  }, [searchUser, selectedMonth, sales]);

  // Pagination logic using filteredSales
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 10);

    const tableColumn = [
      "Order Number",
      "Order Date",
      "Customer Name",
      "Total Amount",
      "Payment Method",
      "Status",
      "Products",
    ];

    const tableRows = [];

    filteredSales.forEach((sale) => {
      const saleDate = sale.orderDate
        ? new Date(sale.orderDate).toLocaleDateString()
        : "N/A";
      const products =
        sale.items && sale.items.length > 0
          ? sale.items.map((item) => item.name || "Unknown Product").join(", ")
          : "No Products";

      const saleData = [
        sale.orderNumber,
        saleDate,
        sale.customerName || "N/A",
        `$${sale.totalAmount.toFixed(2)}`,
        sale.paymentMethod || "N/A",
        sale.status ? sale.status.trim() : "N/A",
        products,
      ];

      tableRows.push(saleData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        6: { cellWidth: 50 },
      },
    });

    const date = new Date();
    const timestamp = date.toISOString().replace(/[-:.]/g, "").slice(0, 15);
    doc.save(`sales_report_${timestamp}.pdf`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Sales Report</h1>

      <div className="flex flex-col md:flex-row gap-4 my-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">Filter by Month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by user"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />

        <button
          onClick={generatePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-1/3 disabled:opacity-50"
          disabled={filteredSales.length === 0}
        >
          Download PDF
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading sales data...</p>
      ) : currentItems.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-7 gap-4 text-sm font-semibold text-gray-700 mb-4 border-b pb-2">
            <p>Order Number</p>
            <p>Order Date</p>
            <p>Customer Name</p>
            <p>Total Amount</p>
            <p>Payment Method</p>
            <p>Status</p>
            <p>Products</p>
          </div>

          {currentItems.map((sale, index) => (
            <div
              key={index}
              className="grid grid-cols-7 gap-4 items-center py-2 text-sm border-b"
            >
              <p>{sale.orderNumber}</p>
              <p>
                {sale.orderDate
                  ? new Date(sale.orderDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>{sale.customerName || "N/A"}</p>
              <p>${sale.totalAmount.toFixed(2)}</p>
              <p>{sale.paymentMethod}</p>
              <p
                className={
                  sale.status && sale.status.trim() === "Delivered"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {sale.status ? sale.status.trim() : "N/A"}
              </p>
              <div className="flex flex-col gap-2">
                {sale.items && sale.items.length > 0 ? (
                  sale.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      {item.images && item.images.length > 0 ? (
                        <img
                          src={`${backendUrl}${item.images[0]}`}
                          alt={`Product ${idx + 1}`}
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                      <p>{item.name || "Unknown Product"}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No Products</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-sm text-gray-500">
          No sales records found
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Sales;
