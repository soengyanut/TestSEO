import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store.js";
import { Provider } from "react-redux";
import Product from "./pages/product/Product.jsx";
import { BrowserRouter, Route, Routes } from "react-router";
import ProductDetail from "./pages/product/ProductDetail.jsx";
import Login from "./pages/auth/Login.jsx";
import RootLayout from "./components/layouts/root-layout.jsx";
import Register from "./pages/auth/Register.jsx";
import Register2 from "./pages/auth/Register2.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<App />} />
            <Route path="/products" element={<Product />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register2/>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
