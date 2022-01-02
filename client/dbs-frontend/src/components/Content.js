import { useEffect } from "react";
import AddStation from "./AddStation";
// import Bookings from "./Bookings";
import classes from "./Content.module.css";
import Profits from "./Profits";
import VendorBookingDaily from "./VendorBookingDaily";
import VendorBookingMonthly from "./VendorBookingMonthly";
import VendorBookings from "./VendorBookings";
import VendorBookingWeekly from "./VendorBookingWeekly";
import VendorStations from "./VendorStations";

const Content = ({ active }) => {
  useEffect(() => {
    console.log(active);
  }, [active]);
  return (
    <div className={classes.outer}>
      {active === 1 ? (
        <AddStation />
      ) : active === 2 ? (
        <VendorStations />
      ) : active === 3 ? (
        <VendorBookings />
      ) : active === 4 ? (
        <Profits />
      ) : active === 8 ? (
        <VendorBookingDaily />
      ) : active === 9 ? (
        <VendorBookingMonthly />
      ) : active === 10 ? (
        <VendorBookingWeekly />
      ) : (
        <AddStation />
      )}
    </div>
  );
};

export default Content;
