import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import classes from "./Home.module.css";
import { Link, Navigate } from "react-router-dom";
const Home = () => {
  const { authenticated, authen } = useContext(AuthContext);
  const [vendoruse, setVendOrUse] = useState("");
  useEffect(() => {
    setVendOrUse(authen);
  }, [authen]);
  return (
    <>
      {authenticated ? (
        vendoruse === "user" ? (
          <Navigate to="/index" />
        ) : (
          <Navigate to="/vendor" />
        )
      ) : (
        <>
          {/* LOGO */}
          <div className={classes.logo}>
            <h1 className={classes.hh1}>
              NA<span className={classes.hspan}>EV</span>GATION{" "}
            </h1>
          </div>
          {/* Login */}
          {/* Register */}
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button className={classes.hbutton}>Login</button>
          </Link>
          <Link to="/register" style={{ textDecoration: "none" }}>
            <button className={classes.hbutton}>Register</button>
          </Link>
          <Link to="/admin" style={{ textDecoration: "none" }}>
            <button className={`${classes.link} ${classes.hbutton}`}>
              For Vendor login click here
            </button>
          </Link>
        </>
      )}
    </>
  );
};

export default Home;
