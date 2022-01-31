import React, { useEffect, useState } from "react";
import classes from "../Vendor/VendorBookings.module.css";
import { TailSpin } from "react-loader-spinner";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("/v1/api/myBookings", {
      headers: {
        authtoken: localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        if (!res.status) {
          setLoading(false);
          alert(res.error);
        } else {
          setBookings(res.booking_list);
          setLoading(false);
        }
      });
  }, []);
  return (
    <>
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
          <div>
            <div className={classes.outer}>
              <h1 className={classes.vh1}>ID</h1>
              <h1 className={classes.vh1}>Bunk Name</h1>
              <h1 className={classes.vh1}>Time</h1>
              <h1 className={classes.vh1}>Status</h1>
              <h1 className={classes.vh1}>Start</h1>
            </div>
          </div>
          {bookings.length === 0 ? (
            <h2>No bookings</h2>
          ) : (
            <>
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
          )}
        </>
      )}
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
