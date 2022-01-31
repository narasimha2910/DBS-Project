import React, { useState } from "react";
import classes from "../Login.module.css";
import classes1 from "./AddVehicle.module.css";
import { TailSpin } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faMotorcycle } from "@fortawesome/free-solid-svg-icons";

const AddVehicle = () => {
  const [plate, setPlate] = useState("");
  const [cat, setCat] = useState(1);
  const [loading, setLoading] = useState(false);
  const getInfo = (e) => {
    e.preventDefault();
    if (plate === "") {
      return;
    }
    setLoading(true);
    fetch("/v1/api/AddVehicle", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        authtoken: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        number_plate: plate,
        category_id: cat,
      }),
    })
      .then((data) => data.json())
      .then((res) => {
        if (!res.status) {
          setLoading(false);
          alert(res.error);
          setPlate("");
          setCat(1);
        } else {
          setLoading(false);
          alert("Vehicle Added successfully");
          setPlate("");
          setCat(1);
        }
      });
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
          <form className={classes.loginform}>
            <h1 id={classes.ltop} className={`${classes.lh1}`}>
              NUMBER PLATE
            </h1>
            <input
              type="text"
              name="username"
              autoComplete="off"
              className={classes.linput}
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
            ></input>
            <h1 className={classes.lh1}>TYPE</h1>
            <div style={{ display: "flex", paddingLeft: 160 }}>
              <div
                className={`${classes1.icon} ${cat === 1 && classes1.active}`}
                onClick={() => setCat(1)}
              >
                <FontAwesomeIcon icon={faCar} />
              </div>
              <div
                className={`${classes1.icon} ${cat === 2 && classes1.active}`}
                onClick={() => setCat(2)}
              >
                <FontAwesomeIcon icon={faMotorcycle} />
              </div>
            </div>
            <button
              className={classes.lbtn}
              style={{ marginTop: 30 }}
              onClick={getInfo}
            >
              ADD
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default AddVehicle;
