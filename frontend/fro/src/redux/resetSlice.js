import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for resetting password
export const resetPassword = createAsyncThunk(
  "reset/resetPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.VITE_BACKEND_URL}/api/user/reset-password/${token}`,
        { newPassword, confirmPassword }
      );
      return response.data; // backend should return { success, message }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Server error" });
    }
  }
);

const safeJSONParse = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item && item !== "undefined" ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const resetSlice = createSlice({
  name: "reset",
  initialState: {
    message: safeJSONParse("message") || null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resetSlice.reducer;
