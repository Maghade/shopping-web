


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/category/list`
    );
    return response.data.categories;
  }
);


// ✅ Restore saved selections
const storedCategory = localStorage.getItem("selectedCategory");
const storedSubCategory = localStorage.getItem("selectedSubCategory");

const initialState = {
  categories: [],
  selectedCategory: storedCategory || "All",
  selectedSubCategory: storedSubCategory || "",
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedSubCategory = "";

      // ✅ Save category — including "All"
      localStorage.setItem("selectedCategory", action.payload);
      localStorage.setItem("selectedSubCategory", "");
    },

    setSubCategory: (state, action) => {
      state.selectedSubCategory = action.payload;

      // ✅ Save subcategory
      localStorage.setItem("selectedSubCategory", action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCategory, setSubCategory } = categorySlice.actions;
export default categorySlice.reducer;
