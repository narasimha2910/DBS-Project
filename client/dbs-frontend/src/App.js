import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import VendorLogin from "./components/VendorLogin";
import AuthContextProvider from "./contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  return (
    <AuthContextProvider>
      <Router>
        <div>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<VendorLogin />} />
            <Route
              path="/index"
              element={
                <ProtectedRoute>
                  <Hero />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
