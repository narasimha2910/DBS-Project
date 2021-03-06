import React, { useEffect, useState } from "react";
import classes from "../Vendor/VendorBookings.module.css";
import { TailSpin } from "react-loader-spinner";

const MyVehicles = () => {
  const [veh, setVeh] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    fetch("/v1/api/vehicles", {
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
          setVeh(res.vehicle_list);
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
              <h1 className={classes.vh1}>Number Plate</h1>
              <h1 className={classes.vh1}>Type</h1>
            </div>
          </div>
          {veh.map((v) => (
            <Vehicle num={v.plate} cat={v.cat} />
          ))}
        </>
      )}
    </>
  );
};

const Vehicle = ({ num, cat }) => {
  return (
    <div>
      <table style={{ fontSize: 20 }}>
        <tbody>
          <tr>
            <td style={{ paddingLeft: 400 }}>{num}</td>
            <td style={{ paddingLeft: 150 }}>{cat}</td>
          </tr>
        </tbody>
      </table>
      <hr></hr>
    </div>
  );
};

export default MyVehicles;
