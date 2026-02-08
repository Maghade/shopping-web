

// redux/productSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = `${import.meta.env.VITE_BACKEND_URL}`;

// ✅ Fetch all products with filters
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const { data } = await axios.get(
        `${backendUrl}/api/product/list?${params.toString()}`
      );

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/single/${id}`);  // ✅ FIXED
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);




// ✅ Slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    categories: [],
    subcategories: [],
    singleProduct: null, // ✅ Store single product
    loading: false,
    error: null,
    selectedCategory: "All",
    selectedSubcategory: null,
    searchTerm: "",
  },

  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedSubcategory = null;
    },
    setSubcategory: (state, action) => {
      state.selectedSubcategory = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      // ✅ Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.categories = action.payload.categories || [];
        state.subcategories = action.payload.subcategories || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ ✅ Fetch single product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});


export const { setCategory, setSubcategory, setSearchTerm } = productSlice.actions;
export default productSlice.reducer;
