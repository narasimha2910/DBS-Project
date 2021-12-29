import Bookings from "./Bookings";
import classes from "./Content.module.css";

const Content = () => {
  return (
    <div className={classes.outer}>
      <Bookings />
    </div>
  );
};

export default Content;
