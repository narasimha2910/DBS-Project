import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCompass,
  faBook,
  faInfoCircle,
  faRupeeSign,
  faPaperPlane,
  faPlusCircle,
  faCommentAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./Sidebar.module.css";
import { useState } from "react";
const Sidebar = ({ setActive }) => {
  const [style, setStyle] = useState("c1");
  return (
    <div className={classes.sidebar}>
      <h2>
        <FontAwesomeIcon icon={faCompass} style={{ paddingRight: "10" }} />
        Menu
      </h2>
      <ul className={classes.sul}>
        <li
          className={`${classes.sli} ${style === "c1" && classes.active}`}
          onClick={() => {
            setStyle("c1");
            setActive(1);
          }}
        >
          <FontAwesomeIcon icon={faBook} style={{ paddingRight: "10" }} />
          Book a station
        </li>
        <li
          className={`${classes.sli} ${style === "c4" && classes.active}`}
          onClick={() => {
            setStyle("c4");
            setActive(4);
          }}
        >
          <FontAwesomeIcon icon={faClock} style={{ paddingRight: "10" }} />
          Ongoing Booking
        </li>
        <li
          className={`${classes.sli} ${style === "c2" && classes.active}`}
          onClick={() => {
            setStyle("c2");
            setActive(2);
          }}
        >
          <FontAwesomeIcon icon={faInfoCircle} style={{ paddingRight: "10" }} />
          Show my bookings
        </li>
        <li
          className={`${classes.sli} ${style === "c3" && classes.active}`}
          onClick={() => {
            setStyle("c3");
            setActive(3);
          }}
        >
          <FontAwesomeIcon icon={faRupeeSign} style={{ paddingRight: "10" }} />
          Payment history
        </li>
        <li
          className={`${classes.sli} ${style === "c5" && classes.active}`}
          onClick={() => {
            setStyle("c5");
            setActive(5);
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} style={{ paddingRight: "10" }} />
          My vehicles
        </li>
        <li
          className={`${classes.sli} ${style === "c6" && classes.active}`}
          onClick={() => {
            setStyle("c6");
            setActive(6);
          }}
        >
          <FontAwesomeIcon icon={faPlusCircle} style={{ paddingRight: "10" }} />
          Add a vehicle
        </li>
        <li
          className={`${classes.sli} ${style === "c7" && classes.active}`}
          onClick={() => {
            setStyle("c7");
            setActive(7);
          }}
        >
          <FontAwesomeIcon icon={faCommentAlt} style={{ paddingRight: "10" }} />
          Chat with us
        </li>
        <li
          className={`${classes.sli} ${style === "c8" && classes.active}`}
          onClick={() => {
            setStyle("c8");
            setActive(8);
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

export default Sidebar;
