import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faBook,
  faInfoCircle,
  faRupeeSign,
  faStar,
  faPaperPlane,
  faPlusCircle,
  faCommentAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./Sidebar.module.css";
const Sidebar = () => {
  return (
    <div className={classes.sidebar}>
      <h2>
        <FontAwesomeIcon icon={faCompass} style={{ paddingRight: "10" }} />
        Menu
      </h2>
      <ul className={classes.sul}>
        <li className={classes.sli}>
          <FontAwesomeIcon icon={faBook} style={{ paddingRight: "10" }} />
          Book a station
        </li>
        <li className={classes.sli}>
          <FontAwesomeIcon icon={faInfoCircle} style={{ paddingRight: "10" }} />
          Show my bookings
        </li>
        <li className={classes.sli}>
          <FontAwesomeIcon icon={faRupeeSign} style={{ paddingRight: "10" }} />
          Payment history
        </li>
        <li className={classes.sli}>
          <FontAwesomeIcon icon={faStar} style={{ paddingRight: "10" }} />
          My reviews
        </li>
        <li className={classes.sli}>
          <FontAwesomeIcon icon={faPaperPlane} style={{ paddingRight: "10" }} />
          My vehicles
        </li>
        <li className={classes.sli}>
          <FontAwesomeIcon icon={faPlusCircle} style={{ paddingRight: "10" }} />
          Add a vehicle
        </li>
        <li className={classes.sli}>
          <FontAwesomeIcon icon={faCommentAlt} style={{ paddingRight: "10" }} />
          Chat with us
        </li>
        <li className={classes.sli}>
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
