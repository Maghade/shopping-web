import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ✅ Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// ------------------ SEND REQUEST ------------------
export const sendRequest = createAsyncThunk(
  "requests/send",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/user/requests`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err) {
      console.error("Send request error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Something went wrong" });
    }
  }
);

// ------------------ FETCH ALL REQUESTS ------------------
export const fetchRequests = createAsyncThunk(
  "requests/get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/requests`);
      return res.data;
    } catch (err) {
      console.error("Fetch request error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Unable to fetch requests" });
    }
  }
);

// ------------------ SLICE DEFINITION ------------------
const requestSlice = createSlice({
  name: "requests",
  initialState: {
    items: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearRequestState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // SEND REQUEST
      .addCase(sendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items.push(action.payload.request || action.payload); // add new request to list
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to send request";
      })

      // FETCH REQUESTS
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.requests || action.payload;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch requests";
      });
  },
});

// Export actions and reducer
export const { clearRequestState } = requestSlice.actions;
export default requestSlice.reducer;
