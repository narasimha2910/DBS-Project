import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authenticated } = useContext(AuthContext);
  const isAuth = localStorage.getItem("isAuth");
  // const isVendorAuth = localStorage.getItem("isVendorAuth");
  // const auth = false
  return authenticated || isAuth ? children : <Navigate to="/" />;
};

const ProtectedVendorRoute = ({ children }) => {
  const { authenticated } = useContext(AuthContext);
  // const isAuth = localStorage.getItem("isAuth");
  const isVendorAuth = localStorage.getItem("isVendorAuth");
  // const auth = false
  return authenticated || isVendorAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
export { ProtectedVendorRoute };
