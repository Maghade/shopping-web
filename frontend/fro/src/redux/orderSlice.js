import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch orders with token authentication
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get token either from Redux state or localStorage
      const { token } = getState().auth || {};
      const authToken = token || localStorage.getItem("token");

      if (!authToken) {
        return rejectWithValue({ message: "User not logged in. Please login again." });
      }

      // Make authenticated request
      const response = await axios.get(`${import.meta.VITE_BACKEND_URL}/api/order/list`, {
        headers: { token: authToken },
      });

      return response.data; // Expected to include { success, orders, message }
    } catch (error) {
      console.error("Error fetching orders:", error);
      return rejectWithValue(error.response?.data || { message: "Failed to fetch orders" });
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;

        // Handle API response structure
        if (action.payload.success) {
          state.orders = action.payload.orders || [];
        } else {
          state.error = action.payload.message || "Failed to load orders";
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Error fetching orders";
      });
  },
});

export default orderSlice.reducer;
