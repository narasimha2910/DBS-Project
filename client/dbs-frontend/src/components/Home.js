import classes from "./Home.module.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
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
      <button className={`${classes.link} ${classes.hbutton}`}>
        For Vendor login click here
      </button>
    </>
  );
};

export default Home;
