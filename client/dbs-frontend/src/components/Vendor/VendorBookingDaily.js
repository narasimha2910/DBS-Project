import React, { useState, useEffect } from "react";
import { Booking } from "./VendorBookings";
import classes from "./VendorBookings.module.css";
import { TailSpin } from "react-loader-spinner";

const VendorBookingDaily = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("/v1/api/showTodayBookings", {
      method: "GET",
      headers: {
        authtoken: localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.status === true) {
          setBookings(res.station_list);
          setLoading(false);
        }
      });
  }, []);

  return (
    <>
      <div className={classes.outer}>
        <h1 className={classes.vh1}>Booking ID</h1>
        <h1 className={classes.vh1}>Username</h1>
        <h1 className={classes.vh1}>Booking Time</h1>
        <h1 className={classes.vh1}>Payment ID</h1>
      </div>
      {loading ? (
        <div
          style={{
            marginTop: 180,
            marginLeft: 500,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TailSpin color="#0d4747" height={150} width={150} />
          <h2 style={{ marginRight: 500 }}>Loading...</h2>
        </div>
      ) : (
        <>
          {bookings.length === 0 ? (
            <h1>No Bookings to show</h1>
          ) : (
            bookings.map((booking) => (
              <Booking
                key={booking.booking_id}
                id={booking.booking_id}
                name={booking.username}
                date={booking.booking_time}
                pid={booking.payment_id}
              />
            ))
          )}
        </>
      )}
    </>
  );
};

export default VendorBookingDaily;
