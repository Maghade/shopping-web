
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";

const Add = ({ token }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Core state
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Files + previews
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Product fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setsubCategory] = useState("");
const [strength, setStrength] = useState("");
const [size, setSize] = useState("")
  // Additional info
  const [brand, setBrand] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [packing, setPacking] = useState("");
  const [countryOfOrigin, setCountryOfOrigin] = useState("");
  const [usageApplication, setUsageApplication] = useState("");

  // Modal + custom fields
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const openModal = () => setShowAdditionalInfo(true);
  const closeModal = () => setShowAdditionalInfo(false);
  const [customFields, setCustomFields] = useState([]);

  const addCustomField = () => setCustomFields([...customFields, { label: "", value: "" }]);
  const updateCustomField = (index, key, value) => {
    const updated = [...customFields];
    updated[index][key] = value;
    setCustomFields(updated);
  };
  const removeCustomField = (index) =>
    setCustomFields(customFields.filter((_, i) => i !== index));

  const saveAdditionalInfo = () => {
    toast.success("Additional info saved!");
    closeModal();
  };

  // File upload handlers
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      const newFiles = [...files, ...selectedFiles];
      setFiles(newFiles);

      const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    try {
      URL.revokeObjectURL(previewUrls[index]);
    } catch (e) {}
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };



const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", Number(price)); // ✅ ensure numeric
    formData.append("category", category);
    formData.append("subCategories", JSON.stringify([subcategory]));
    formData.append("brand", brand);
    formData.append("manufacturer", manufacturer);
    formData.append("packing", packing);
    formData.append("strength", strength);
    formData.append("usageApplication", usageApplication);
    formData.append("countryOfOrigin", countryOfOrigin);
    formData.append("size", size);

    if (customFields && customFields.length > 0) {
      formData.append("customFields", JSON.stringify(customFields));
    }

    if (files && files.length > 0) {
      files.forEach((file) => formData.append("files", file));
    }

    const response = id
      ? await axios.put(`${backendUrl}/api/product/update/${id}`, formData, {
          headers: { token },
        })
      : await axios.post(`${backendUrl}/api/product/add`, formData, {
          headers: { token },
        });

    if (response.data.success) {
      toast.success(response.data.message);
      onFinishHandler();
    } else {
      toast.error(response.data.message || "Failed to save product");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong while saving product");
  }
};


  const onFinishHandler = () => {
    setName("");
    setDescription("");
    setFiles([]);
    previewUrls.forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    setPreviewUrls([]);
    setPrice("");
    setBrand("");
    setManufacturer("");
    setPacking("");
    setCountryOfOrigin("");
    setUsageApplication("");
    setCustomFields([]);
    setSize("");
    navigate("/products/list");
  };

  // Fetch categories
  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/category/list");
      if (response.data.success) {
        setCategories(response.data.categories.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch product for edit
  const fetchProductData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/product/single/${id}`);
      if (response.data.success) {
        const product = response.data.product;
        setName(product.name || "");
        setDescription(product.description || "");
        if (product.category) setCategory(product.category._id || product.category);
        if (product.subCategories && product.subCategories.length) {
          setsubCategory(product.subCategories[0]?._id || product.subCategories[0] || "");
        } else if (product.subcategory) {
          setsubCategory(product.subcategory._id || product.subcategory || "");
        }
        setPrice(product.price || "");
        if (product.images) {
          const imageUrls = product.images.map((image) => `${backendUrl}${image}`);
          setPreviewUrls(imageUrls);
          const fileObjects = await Promise.all(
            imageUrls.map(async (url) => {
              try {
                const res = await fetch(url);
                const blob = await res.blob();
                const fileName = url.split("/").pop();
                return new File([blob], fileName, { type: blob.type });
              } catch (err) {
                return null;
              }
            })
          );
          setFiles(fileObjects.filter(Boolean));
        }


        setBrand(product.brand || "");
        setManufacturer(product.manufacturer || "");
        setPacking(product.packing || "");
        setCountryOfOrigin(product.countryOfOrigin || "");
        setUsageApplication(product.usageApplication || "");
        setSize(product.size || "");
        setCustomFields(product.customFields || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchList();
      if (id) await fetchProductData();
    };
    loadData();
  }, [id]);

useEffect(() => {
  const selectedCategory = categories.find((c) => c._id === category);

  if (selectedCategory && selectedCategory.subcategories) {
    setSubcategories(selectedCategory.subcategories);

    // Automatically select the only subcategory if there's just one
    if (selectedCategory.subcategories.length === 1) {
      setsubCategory(selectedCategory.subcategories[0]._id);
    }
  } else {
    setSubcategories([]);
    setsubCategory("");
  }
}, [category, categories]);

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-6">
      {/* File Upload */}
      <div className="flex gap-4">
        <label className="cursor-pointer border p-3 rounded bg-gray-100">
          Upload Product Images
          <input type="file" accept="image/*" hidden onChange={handleFileChange} multiple />
        </label>
      </div>

      {/* Image Previews */}
      <div className="flex flex-wrap gap-4 mt-3">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative">
            <img src={url} alt={`Preview ${index + 1}`} className="w-32 h-32 object-cover rounded-lg border" />
            <button
              onClick={() => removeImage(index)}
              type="button"
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2 font-semibold">Product name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-4 py-2 border rounded"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-2 font-semibold">Product description</p>
        <Editor
          apiKey="6c399k87ba9w0mkqaqp97ohtihgcopjhv222c22nyunwq8pq"
          value={description}
          onEditorChange={(newContent) => setDescription(newContent)}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              "advlist autolink lists link charmap print preview anchor",
              "searchreplace visualblocks code fullscreen",
              "insertdatetime media table paste code help wordcount",
            ],
            toolbar:
              "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          }}
        />
      </div>

          {/* Category Selection */}
        <div className="flex gap-4 mb-4">
          {/* Category */}
          <div className="flex-1">
            <p className="mb-2 font-semibold">Product Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          {subcategories.length > 0 && (
            <div className="flex-1">
              <p className="mb-2 font-semibold">Product Subcategory</p>
              <select
                value={subcategory}
                onChange={(e) => setsubCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

<div className="flex-1">
          <p className="mb-2 font-semibold">Product Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-40 px-4 py-2 border rounded"
            type="number"
            placeholder="25"
          />
        </div>
        </div>

{/* Size Selection */}
<div className="w-full mt-4 col-span-2">
  <p className="mb-2 font-semibold">Size</p>

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
</div>
 

      {/* Buttons */}
      <div className="flex gap-6 mt-6">
        <button type="submit" className="w-32 py-3 bg-primary text-white rounded-lg disabled:opacity-50" disabled={loading}>
          {id ? "UPDATE" : "ADD PRODUCT"}
        </button>
        <button type="button" className="w-32 py-3 bg-secondary text-white rounded-lg" onClick={onFinishHandler} disabled={loading}>
          CANCEL
        </button>
        <button type="button" className="w-40 py-3 bg-primary text-white rounded-lg" onClick={openModal} disabled={loading}>
          Additional Info
        </button>
      </div>

      {/* Additional Info Modal */}
      {showAdditionalInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[420px] shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4 text-center">Additional Information</h2>

            {/* Packaging Type */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Packaging Type</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={packing}
                onChange={(e) => setPacking(e.target.value)}
                placeholder="e.g., Box"
              />
            </div>

            {/* Brand */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Brand</label>
              {/* <input
                type="text"
                className="w-full border p-2 rounded"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., Blueforce"
              /> */}
              <input name="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />

            </div>

            {/* Manufacturer */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Manufacturer</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="e.g., Swiss Pharmaceutical"
              />
            </div>

            {/* Country of Origin */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Country of Origin</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={countryOfOrigin}
                onChange={(e) => setCountryOfOrigin(e.target.value)}
                placeholder="e.g., India"
              />
            </div>

            {/* Custom Fields */}
            <h3 className="text-md font-medium mt-4 mb-2 text-gray-700">Add Custom Details (Optional)</h3>

            {customFields.map((field, index) => (
              <div key={index} className="mb-3 border rounded p-2 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Custom Field {index + 1}</label>
                  <button type="button" className="text-red-500 text-xs" onClick={() => removeCustomField(index)}>✕</button>
                </div>

                <input
                  type="text"
                  className="w-full border p-2 rounded mb-2"
                  value={field.label}
                  onChange={(e) => updateCustomField(index, "label", e.target.value)}
                  placeholder="Label (e.g., Storage Info)"
                />
                <input
                  type="text"
                  className="w-full border p-2 rounded"
                  value={field.value}
                  onChange={(e) => updateCustomField(index, "value", e.target.value)}
                  placeholder="Value (e.g., Store in a cool place)"
                />
              </div>
            ))}

            <button
              type="button"
              className="w-full border border-dashed border-gray-400 text-gray-600 py-2 rounded hover:bg-gray-100 mb-4"
              onClick={addCustomField}
            >
              + Add More Field
            </button>

            <div className="flex justify-end gap-3">
              <button type="button" className="px-4 py-2 bg-gray-300 rounded" onClick={closeModal}>Cancel</button>
              <button type="button" className="px-4 py-2 bg-green-600 text-white rounded" onClick={saveAdditionalInfo}>Save</button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};


export default Add;

