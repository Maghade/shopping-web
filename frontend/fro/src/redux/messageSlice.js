import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for sending message
export const sendMessage = createAsyncThunk(
  "messages/send",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${import.meta.VITE_BACKEND_URL}/api/message/send`, formData);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


// Async thunk for fetching messages
export const fetchMessages = createAsyncThunk(
  "messages/get",
  async () => {
    const res = await axios.get(`${import.meta.VITE_BACKEND_URL}/api/message/get`);
    return res.data;
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    items: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.items.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default messageSlice.reducer;
