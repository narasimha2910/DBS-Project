import React from "react";
import ComingSoon from "../ComingSoon";
import classes from "../Vendor/VendorContent.module.css";
import AddVehicle from "./AddVehicle";
import BookingHistory from "./BookingHistory";
import Bookings from "./Bookings";
import MyVehicles from "./MyVehicles";
import OngoingBooking from "./OngoingBooking";
import PaymentHistory from "./PaymentHistory";

const SwitchCase = (active) => {
  switch (active) {
    case 1:
      return <Bookings />;
    case 2:
      return <BookingHistory />;
    case 3:
      return <PaymentHistory />;
    case 4:
      return <OngoingBooking />;
    case 5:
      return <MyVehicles />;
    case 6:
      return <AddVehicle />;
    default:
      return <ComingSoon />;
  }
};

const Content = ({ active }) => {
  return <div className={classes.outer}>{SwitchCase(active)}</div>;
};

export default Content;
