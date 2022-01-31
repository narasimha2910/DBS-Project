import React, { useEffect, useState } from "react";
import classes from "./VendorStations.module.css";
import { TailSpin } from "react-loader-spinner";

const VendorStations = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

  //   const getStations = async () => {
  //     try {
  //       const data = await fetch("/v1/api/showMyStations", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           authtoken: localStorage.getItem("token"),
  //         },
  //       });
  //       const res = await data.json();
  //       console.log(res.station_list);
  //       if (res.status === true) {
  //         const station_array = await res.station_list;
  //         console.log(station_array);
  //         setStations(station_array);
  //         console.log(stations);
  //       } else {
  //         alert(res.error);
  //       }
  //     } catch (Err) {
  //       console.log(Err);
  //     }
  //   };

  useEffect(() => {
    setLoading(true);
    fetch("/v1/api/showMyStations", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authtoken: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === true) {
          setStations(res.station_list);
          setLoading(false);
        } else {
          setLoading(false);
          alert(res.error);
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
          <div className={classes.outer}>
            <h1 className={classes.vh1}>ID</h1>
            <h1 className={classes.vh1}>Type</h1>
            <h1 className={classes.vh1}>Status</h1>
          </div>
          {stations.map((station, index) => {
            return (
              <Station
                key={index}
                id={station.station_id}
                type={station.category}
                status={station.is_available ? "Available" : "Booked"}
              />
            );
          })}
        </>
      )}
    </>
  );
};

export default VendorStations;

const Station = ({ id, type, status }) => {
  return (
    <div>
      <h2 className={classes.vh2}>{id}</h2>
      <h2 className={classes.vh2}>{type}</h2>
      <h2 className={classes.vh2}>{status}</h2>
      <hr></hr>
    </div>
  );
};
