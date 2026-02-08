import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import App from "./App";
import { useState } from "react";


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
