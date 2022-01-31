import AddStation from "./AddStation";
// import Bookings from "./Bookings";
import classes from "./VendorContent.module.css";
import Profits from "./Profits";
import VendorBookingDaily from "./VendorBookingDaily";
import VendorBookingMonthly from "./VendorBookingMonthly";
import VendorBookings from "./VendorBookings";
import VendorBookingWeekly from "./VendorBookingWeekly";
import VendorStations from "./VendorStations";
import ComingSoon from "../ComingSoon";
import VerifyOTP from "./VerifyOTP";

const SwitchCase = (active) => {
  switch (active) {
    case 1:
      return <AddStation />;
    case 2:
      return <VendorStations />;
    case 3:
      return <VendorBookings />;
    case 4:
      return <Profits />;
    case 8:
      return <VendorBookingDaily />;
    case 9:
      return <VendorBookingMonthly />;
    case 10:
      return <VendorBookingWeekly />;
    case 11:
      return <VerifyOTP />

    default:
      return <ComingSoon />;
  }
};

const VendorContent = ({ active }) => {
  return <div className={classes.outer}>{SwitchCase(active)}</div>;
};

export default VendorContent;

// {
//   active === 1 ? (
//     <AddStation />
//   ) : active === 2 ? (
//     <VendorStations />
//   ) : active === 3 ? (
//     <VendorBookings />
//   ) : active === 4 ? (
//     <Profits />
//   ) : active === 8 ? (
//     <VendorBookingDaily />
//   ) : active === 9 ? (
//     <VendorBookingMonthly />
//   ) : active === 10 ? (
//     <VendorBookingWeekly />
//   ) : (
//     <AddStation />
//   );
// }
