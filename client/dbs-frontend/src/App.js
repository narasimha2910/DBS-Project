import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import VendorLogin from "./components/VendorLogin";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<VendorLogin />} />
          <Route path="/index" element={<Hero />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
