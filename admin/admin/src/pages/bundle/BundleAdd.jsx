import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const BundleAdd = ({ token }) => {
  const [list, setList] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [bundleName, setBundleName] = useState("");
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [selectedCoupon, setSelectedCoupon] = useState("");

  const [isEditing, setIsEditing] = useState(false); // New state
  const { id } = useParams(); // Get bundle ID from URL (for editing)

  const navigate = useNavigate();

  // 🟢 Fetch product list
  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        if (response.data.success) {
          setList(response.data.products.reverse());
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchList();
  }, []);

  // 🟢 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/list`);
        if (response.data.success) {
          setCategories(response.data.categories.reverse());
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchCategories();
  }, []);

  // 🟢 Fetch existing bundle if editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchBundleDetails();
    }
  }, [id]);

  const fetchBundleDetails = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/bundle/single/${id}`);

      if (response.data.success && response.data.bundle) {
        const bundle = response.data.bundle;
        setBundleName(bundle.name || "");
        setCategory(bundle.category || "");
        setSelectedCoupon(bundle.coupons?.[0] || ""); // ✅ Store only one coupon
        setSelectedProductIds(bundle.products || []);
      } else {
        toast.error("Bundle not found");
      }
    } catch (error) {
      console.error("Error fetching bundle:", error);
      toast.error("Failed to fetch bundle details.");
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((pid) => pid !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: bundleName,
      category,
      coupons: selectedCoupon ? [selectedCoupon] : [], // ✅ Send only one coupon
      productIds: selectedProductIds,
    };

    try {
      let response;
      if (isEditing) {
        response = await axios.put(
          `${backendUrl}/api/bundle/update/${id}`,
          formData,
          {
            headers: { token },
          }
        );
      } else {
        response = await axios.post(`${backendUrl}/api/bundle/add`, formData, {
          headers: { token },
        });
      }

      if (response.data.success) {
        toast.success(
          isEditing
            ? "Bundle updated successfully!"
            : "Bundle added successfully!"
        );
        navigate("/bundle/list");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error("Failed to save bundle. Try again.");
    }
  };

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/coupon/list`, {
          headers: { token },
        });

        if (response.data.success) {
          setCoupons(response.data.coupons || []); // Ensure it's always an array
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Bundle" : "Add New Bundle"}
      </h2>

      <div className="flex items-center gap-2 mb-4">
        <label className="text-lg font-semibold">Bundle Name</label>
        <input
          type="text"
          className="border p-2 w-64 rounded-md"
          placeholder="Enter bundle name"
          value={bundleName}
          onChange={(e) => setBundleName(e.target.value)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <p className="font-semibold">Product Category</p>
          <select
            className="border p-2 w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <p className="font-semibold">Filter by Product Name</p>
          <input
            type="text"
            className="border p-2 w-full"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold">Selected Coupon</p>
        <select
          className="border p-2 w-full"
          value={selectedCoupon}
          onChange={(e) => setSelectedCoupon(e.target.value)} // ✅ Update selected coupon
        >
          <option value="">Select a Coupon</option>
          {coupons.length > 0 &&
            coupons.map((coupon) => (
              <option key={coupon._id} value={coupon.code}>
                {coupon.code}
              </option>
            ))}
        </select>

        {selectedCoupon && (
          <p className="mt-2 text-green-600 font-semibold">
            Selected: {selectedCoupon}
          </p> // ✅ Show selected coupon
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        {list
          .filter((product) => {
            const matchesCategory = category
              ? product.category === category
              : true;
            const matchesName = searchTerm
              ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
              : true;
            return matchesCategory && matchesName;
          })
          .map((item) => (
            <div key={item._id} className="border p-4 rounded-lg">
              <div className="relative">
                {item.images.length > 0 && (
                  <img
                    className="w-full h-40 object-cover rounded-lg border cursor-pointer"
                    src={`${backendUrl + item.images[0]}`}
                    alt="Product"
                  />
                )}
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(item._id)}
                  onChange={() => handleCheckboxChange(item._id)}
                  className="absolute top-2 left-2 w-4 h-4 cursor-pointer"
                />
              </div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-500">{item.category}</p>
            </div>
          ))}
      </div>

      <button
        type="submit"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        {isEditing ? "Update Bundle" : "Add Bundle"}
      </button>
    </form>
  );
};

export default BundleAdd;
