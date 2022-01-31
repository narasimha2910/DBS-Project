import React, { useState } from "react";
import classes from "../Register.module.css";

const VerifyOTP = () => {
  const [otp, setOTP] = useState("");
  const [bid, setBid] = useState("");
  const VerifyBooking = (e) => {
    if (otp === "" || bid === "") {
      alert("Bad request");
      return;
    }
    e.preventDefault();
    fetch("/v1/api/verifyBooking", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authtoken: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        otp: otp,
        booking_id: bid,
      }),
    })
      .then((data) => data.json())
      .then((res) => {
        if (!res.status) {
          alert(res.error);
          setOTP("");
          setBid("");
        } else {
          alert(res.message);
          setOTP("");
          setBid("");
        }
      });
  };

  return (
    <div>
      <form style={{ marginTop: "6rem" }}>
        <h2>OTP</h2>
        <input
          type="text"
          name="OTP"
          id="otp"
          value={otp}
          className={classes.rinput}
          onChange={(e) => {
            setOTP(e.target.value);
          }}
        />
        <h2>Booking ID</h2>
        <input
          type="text"
          name="b_id"
          id="b_id"
          value={bid}
          className={classes.rinput}
          onChange={(e) => {
            setBid(e.target.value);
          }}
        />
        <button className={classes.rbutton} onClick={VerifyBooking}>
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;
