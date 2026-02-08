// src/redux/AuthSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Helper to safely parse JSON from localStorage
const safeJSONParse = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item && item !== "undefined" ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  token: localStorage.getItem("token") || null,
  cartItems: safeJSONParse("cartItems") || {},
  user: safeJSONParse("user") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      localStorage.setItem("cartItems", JSON.stringify(action.payload));
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.cartItems = {};
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cartItems");
    },
  },
});

export const { setToken, clearToken, setCartItems, setUser, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
