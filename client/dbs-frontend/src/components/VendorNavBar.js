import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import classes from "./Navbar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChargingStation,
  faPowerOff,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const VendorNavBar = () => {
  const { logout } = useContext(AuthContext);
  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        <h1 className={classes.nh1}>
          <FontAwesomeIcon icon={faChargingStation} />
          {/* <span className={classes.navspan}>EV</span> */}
        </h1>
      </div>
      <div className={classes.links}>
        <ul className={classes.nul}>
          <li className={classes.nli} onClick={() => console.log("success")}>
            <FontAwesomeIcon icon={faUser} style={{ paddingRight: "10" }} />
            Profile
          </li>
          <li
            className={classes.nli}
            onClick={() => {
              logout();
            }}
          >
            <FontAwesomeIcon icon={faPowerOff} style={{ paddingRight: "10" }} />
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default VendorNavBar;
