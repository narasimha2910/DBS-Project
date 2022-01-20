import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faMotorcycle } from "@fortawesome/free-solid-svg-icons";
import classes from "./AddStation.module.css";

const AddStation = () => {
  const clickHandler = async (category) => {
    try {
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
      console.log(res);
      if (res.status === true) {
        alert(
          category === 1 ? "Car station added" : "Motorcycle station Added"
        );
      } else {
        alert(res.error);
      }
    } catch (Err) {
      console.log(Err);
    }
  };

  return (
    <div>
      <div id={classes.icon} onClick={() => clickHandler(1)}>
        <FontAwesomeIcon icon={faCar} />
      </div>
      <div id={classes.icon} onClick={() => clickHandler(2)}>
        <FontAwesomeIcon icon={faMotorcycle} />
      </div>
    </div>
  );
};

export default AddStation;
