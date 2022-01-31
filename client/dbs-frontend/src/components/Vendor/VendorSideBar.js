import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faInfoCircle,
  faStar,
  faCommentAlt,
  faRupeeSign,
  faExclamationTriangle,
  faPlusCircle,
  faArrowAltCircleRight
} from "@fortawesome/free-solid-svg-icons";
import classes from "./VendorSideBar.module.css";
const VendorSideBar = ({ setActiveHandler }) => {
  const [style, setStyle] = useState("c11");
  return (
    <div className={classes.sidebar}>
      <h2>
        <FontAwesomeIcon icon={faCompass} style={{ paddingRight: "10" }} />
        Menu
      </h2>
      <ul className={classes.sul}>
        <li
          className={`${classes.sli} ${style === "c11" && classes.active}`}
          onClick={() => {
            setStyle("c11");
            setActiveHandler(11);
          }}
        >
          <FontAwesomeIcon icon={faArrowAltCircleRight} style={{ paddingRight: "10" }} />
          Verify OTP
        </li>
        <li
          className={`${classes.sli} ${style === "c1" && classes.active}`}
          onClick={() => {
            setStyle("c1");
            setActiveHandler(1);
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} style={{ paddingRight: "10" }} />
          Add a station
        </li>
        <li
          className={`${classes.sli} ${style === "c2" && classes.active}`}
          onClick={() => {
            setActiveHandler(2);
            setStyle("c2");
          }}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ paddingRight: "10" }} />
          Show my stations
        </li>
        <li
          className={`${classes.sli} ${style === "c3" && classes.active}`}
          onClick={() => {
            setActiveHandler(3);
            setStyle("c3");
          }}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ paddingRight: "10" }} />
          Show my bookings
        </li>
        <li
          className={`${classes.sli} ${style === "c8" && classes.active}`}
          onClick={() => {
            setActiveHandler(8);
            setStyle("c8");
          }}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ paddingRight: "10" }} />
          Bookings Today
        </li>
        <li
          className={`${classes.sli} ${style === "c9" && classes.active}`}
          onClick={() => {
            setActiveHandler(9);
            setStyle("c9");
          }}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ paddingRight: "10" }} />
          Bookings This Month
        </li>
        <li
          className={`${classes.sli} ${style === "c10" && classes.active}`}
          onClick={() => {
            setActiveHandler(10);
            setStyle("c10");
          }}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ paddingRight: "10" }} />
          Bookings This Week
        </li>
        <li
          className={`${classes.sli} ${style === "c4" && classes.active}`}
          onClick={() => {
            setActiveHandler(4);
            setStyle("c4");
          }}
        >
          <FontAwesomeIcon icon={faRupeeSign} style={{ paddingRight: "10" }} />
          My Profits
        </li>
        <li
          className={`${classes.sli} ${style === "c5" && classes.active}`}
          onClick={() => {
            setActiveHandler(5);
            setStyle("c5");
          }}
        >
          <FontAwesomeIcon icon={faStar} style={{ paddingRight: "10" }} />
          My Rating
        </li>
        {/* <li className={classes.sli}>
          <FontAwesomeIcon icon={faPaperPlane} style={{ paddingRight: "10" }} />
          My vehicles
        </li>
        <li className={classes.sli}>
          <FontAwesomeIcon icon={faPlusCircle} style={{ paddingRight: "10" }} />
          Add a vehicle
        </li> */}
        <li
          className={`${classes.sli} ${style === "c6" && classes.active}`}
          onClick={() => {
            setActiveHandler(6);
            setStyle("c6");
          }}
        >
          <FontAwesomeIcon icon={faCommentAlt} style={{ paddingRight: "10" }} />
          Chat with us
        </li>
        <li
          className={`${classes.sli} ${style === "c7" && classes.active}`}
          onClick={() => {
            setActiveHandler(7);
            setStyle("c7");
          }}
        >
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            style={{ paddingRight: "10" }}
          />
          Report an issue
        </li>
      </ul>
    </div>
  );
};

export default VendorSideBar;
