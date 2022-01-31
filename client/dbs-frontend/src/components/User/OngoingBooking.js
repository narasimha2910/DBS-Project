import React, { useEffect, useState } from "react";
import classes from "../Vendor/VendorBookings.module.css";
import classes1 from "../Register.module.css";
import { TailSpin } from "react-loader-spinner";

const OngoingBooking = () => {
  const [booking, setBooking] = useState({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("/v1/api/ongoingBooking", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        authtoken: localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        if (!res.status) {
          //   alert(res.error);
          setBooking(res);
          setLoading(false);
        } else {
          setBooking(res);
          setLoading(false);
        }
      });
  }, []);
  return (
    <>
      {" "}
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
          <div className={classes.outer}>
            <h1 className={classes.vh1}>Booking ID</h1>
            <h1 className={classes.vh1}>Station ID</h1>
            <h1 className={classes.vh1}>Booking Time</h1>
            <h1 className={classes.vh1}>Start Time</h1>
          </div>
          {booking.status ? (
            <>
              <table style={{ fontSize: 20 }}>
                <tbody>
                  <tr>
                    <td style={{ paddingLeft: 150 }}>{booking.booking_id}</td>
                    <td style={{ paddingLeft: 200 }}>{booking.station_id}</td>
                    <td style={{ paddingLeft: 130 }}>{booking.booking_time}</td>
                    <td style={{ paddingLeft: 150 }}>{booking.start_time}</td>
                  </tr>
                </tbody>
              </table>
              <button
                disabled={booking.start_time === null ? true : false}
                className={classes1.rbutton}
                onClick={() => {
                  fetch(`/v1/api/pay/${booking.booking_id}`, {
                    method: "GET",
                    headers: {
                      "Content-type": "application/json",
                      authtoken: localStorage.getItem("token"),
                    },
                  })
                    .then((data) => data.json())
                    .then((res) => {
                      if (!res.status) {
                        alert(res.error);
                      } else {
                        alert(
                          `Amount ${res.amount} payed towards booking with booking id ${booking.booking_id}`
                        );
                      }
                    });
                }}
              >
                Pay
              </button>
            </>
          ) : (
            <h1>{booking.error}</h1>
          )}
        </>
      )}
    </>
  );
};

export default OngoingBooking;
