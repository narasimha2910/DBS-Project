import { useEffect, useState } from "react";
import classes from "./Bookings.module.css";
import { TailSpin } from "react-loader-spinner";

// const BookAStation = (category) => {
//   fetch(`/v1/api/book/${category}`, {
//     method: "GET",
//     headers: {
//       "Content-type": "application/json",
//       authtoken: localStorage.getItem("token"),
//     },
//   })
//     .then((data) => data.json())
//     .then((res) => console.log(res));
// };

const Bookings = () => {
  const [vendorList, setVendorList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/v1/api/stationList", {
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
          setVendorList(res.vendors_list);
          setLoading(false);
        }
      });
  }, []);

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
      ) : vendorList.length === 0 ? (
        <h2>No stations available</h2>
      ) : (
        vendorList.map((booking) => (
          <Booking
            key={booking.vendor_id}
            idx={booking.vendor_id}
            name={booking.vendor_name}
            latitude={booking.latitude}
            longitude={booking.longitude}
            fourWheeler={booking.f_wheeler}
            twoWheeler={booking.t_wheeler}
            setLoading={setLoading}
          />
        ))
      )}
    </div>
  );
};

const Booking = ({
  idx,
  name,
  latitude,
  longitude,
  fourWheeler,
  twoWheeler,
  setLoading,
}) => {
  return (
    <div className={classes.booking}>
      <div className={classes.innerDiv1}>
        <h1 className={classes.bh1}>
          {name}{" "}
          <span className={classes.bspan}>
            Rating: {(Math.random() * 5).toFixed(2)}
          </span>
        </h1>
        <p className={classes.bp1}>Loc: ({`${latitude}, ${longitude}`})</p>
      </div>
      <div className={classes.innerDiv2}>
        <button
          className={classes.bbutton}
          onClick={() => {
            setLoading(true);
            fetch(`/v1/api/Book/1/${idx}`, {
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
                  setLoading(false);
                  alert(
                    `Booking successful with booking ID ${res.booking_id} and station ID ${res.station_id}. The bunk is ${name}`
                  );
                }
              });
          }}
        >
          4 wheeler ({fourWheeler})
        </button>
        <button
          className={classes.bbutton}
          onClick={() => {
            setLoading(true);
            fetch(`/v1/api/Book/2/${idx}`, {
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
                  setLoading(false);
                  alert(
                    `Booking successful with booking ID ${res.booking_id} and station ID ${res.station_id}. The bunk is ${name}`
                  );
                }
              });
          }}
        >
          2 wheeler ({twoWheeler})
        </button>
      </div>
    </div>
  );
};

export default Bookings;
