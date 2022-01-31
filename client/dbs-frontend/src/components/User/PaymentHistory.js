import React, { useEffect, useState } from "react";
import classes from "../Vendor/VendorBookings.module.css";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    fetch("/v1/api/paymentsHistory", {
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
          setPayments(res.payments_list);
        }
      });
  }, []);
  return (
    <div>
      <div className={classes.outer}>
        <h1 className={classes.vh1}>Pay ID</h1>
        <h1 className={classes.vh1}>Bunk Name</h1>
        <h1 className={classes.vh1}>Payment Time</h1>
        <h1 className={classes.vh1}>Payment Status</h1>
      </div>
      {payments.map((payment) => (
        <Payment
          pid={payment.payment_id}
          name={payment.vendor_name}
          time={payment.payment_time}
          status={payment.payment_status}
        />
      ))}
    </div>
  );
};

const Payment = ({ pid, name, time, status }) => {
  return (
    <div>
      <table style={{ fontSize: 20 }}>
        <tbody>
          <tr>
            <td style={{ paddingLeft: 150 }}>{pid}</td>
            <td style={{ paddingLeft: 150 }}>{name}</td>
            <td style={{ paddingLeft: 100 }}>{time}</td>
            <td style={{ paddingLeft: 100 }}>{status}</td>
          </tr>
        </tbody>
      </table>
      <hr></hr>
    </div>
  );
};

export default PaymentHistory;
