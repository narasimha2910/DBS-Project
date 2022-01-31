import React, { useEffect, useState } from "react";
import classes from "../Vendor/VendorBookings.module.css";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    fetch("/v1/api/myBookings", {
      headers: {
        authtoken: localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        if (!res.status) {
          alert(res.error);
        } else {
          setBookings(res.booking_list);
        }
      });
  }, []);
  return (
    <>
      <div>
        <div className={classes.outer}>
          <h1 className={classes.vh1}>ID</h1>
          <h1 className={classes.vh1}>Bunk Name</h1>
          <h1 className={classes.vh1}>Time</h1>
          <h1 className={classes.vh1}>Status</h1>
          <h1 className={classes.vh1}>Start</h1>
        </div>
      </div>
      {bookings.map((booking) => (
        <Booking
          bid={booking.b_id}
          name={booking.ev_bunk}
          time={booking.time}
          stime={booking.stime}
          status={booking.status}
        />
      ))}
    </>
  );
};

const Booking = ({ bid, name, time, status, stime }) => {
  return (
    <div>
      <table style={{ fontSize: 20 }}>
        <tbody>
          <tr>
            <td style={{ paddingLeft: 140 }}>{bid}</td>
            <td style={{ paddingLeft: 150 }}>{name}</td>
            <td style={{ paddingLeft: 100 }}>{time}</td>
            <td style={{ paddingLeft: 100 }}>{status}</td>
            <td style={{ paddingLeft: 100 }}>{stime}</td>
          </tr>
        </tbody>
      </table>
      <hr></hr>
    </div>
  );
};

export default BookingHistory;
