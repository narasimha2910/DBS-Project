import React, { useEffect, useState } from "react";
import classes from "../Vendor/VendorBookings.module.css";
import { TailSpin } from "react-loader-spinner";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
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
          setLoading(false);
          alert(res.error);
        } else {
          setPayments(res.payments_list);
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
              <h1 className={classes.vh1}>Pay ID</h1>
              <h1 className={classes.vh1}>Bunk Name</h1>
              <h1 className={classes.vh1}>Payment Time</h1>
              <h1 className={classes.vh1}>Payment Status</h1>
            </div>
            {payments.length === 0 ? (
              <h2>No payments to show</h2>
            ) : (
              <>
                {payments.map((payment) => (
                  <Payment
                    pid={payment.payment_id}
                    name={payment.vendor_name}
                    time={payment.payment_time}
                    status={payment.payment_status}
                  />
                ))}
              </>
            )}
          </div>
        </>
      )}
    </>
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
