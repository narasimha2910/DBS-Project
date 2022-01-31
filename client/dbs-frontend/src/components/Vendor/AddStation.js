import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faMotorcycle } from "@fortawesome/free-solid-svg-icons";
import classes from "./AddStation.module.css";
import { TailSpin } from "react-loader-spinner";

const AddStation = () => {
  const [loading, setLoading] = useState(false);
  const clickHandler = async (category) => {
    try {
      setLoading(true);
      const data = await fetch("/v1/api/addStation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          category: category,
        }),
      });
      const res = await data.json();
      if (res.status === true) {
        setLoading(false);
        alert(
          category === 1 ? "Car station added" : "Motorcycle station Added"
        );
      } else {
        setLoading(false);
        alert(res.error);
      }
    } catch (Err) {
      setLoading(false);
    }
  };

  return (
    <div>
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
          <div id={classes.icon} onClick={() => clickHandler(1)}>
            <FontAwesomeIcon icon={faCar} />
          </div>
          <div id={classes.icon} onClick={() => clickHandler(2)}>
            <FontAwesomeIcon icon={faMotorcycle} />
          </div>
        </>
      )}
    </div>
  );
};

export default AddStation;
