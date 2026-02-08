import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import categoryReducer from "./categorySlice";
import messageReducer from "./messageSlice";
import forgotReducer from "./forgotSlice";
import resetReducer from "./resetSlice";
import requestReducer from "./requestSlice";
import orderReducer from "./orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
    messages: messageReducer,
    forgot: forgotReducer,
    reset: resetReducer,
    requests: requestReducer,
    orders: orderReducer,
  },
});
