import { useState } from "react";
import "./App.css";
import { RegisterForm } from "./pages/auth/RegisterForm";
import { LoginForm } from "./pages/auth/LoginForm";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { Products } from "./pages/Products";

function App() {
  return (
 
      <Routes>
        <Route index element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/Produits" element={<Products />} />
      </Routes>
 
  );
}

export default App;
