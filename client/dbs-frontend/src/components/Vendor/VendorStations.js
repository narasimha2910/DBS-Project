import React, { useEffect, useState } from "react";
import classes from "./VendorStations.module.css";

const VendorStations = () => {
  const [stations, setStations] = useState([]);

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
        } else {
          alert(res.error);
        }
      });
  }, []);

  return (
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
