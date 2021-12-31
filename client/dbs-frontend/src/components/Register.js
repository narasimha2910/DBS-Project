import { useState } from "react";
import { Navigate } from "react-router-dom";
import classes from "./Register.module.css";

const register = async (name, password, username, phone, email, profileurl) => {
  const data = await fetch("/v1/api/Register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      username,
      password,
      phone,
      email,
      profile_url: profileurl,
    }),
  });
  const res = await data.json();
  console.log(res);
  if (res.status === true) {
    return true;
  } else if (res.status === false) {
    alert(res.error)
    return false;
  }
};

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileurl, setProfileUrl] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const resul = await register(name, password, username, phone, email, profileurl);
    console.log(resul);
    setResult(resul);
  };

  return (
    <div>
      {" "}
      {result ? (
        <Navigate to="/login" />
      ) : (
        <>
          <form autoComplete="off" className={classes.rform}>
            <h1 id={classes.rtop} className={`${classes.rh1}`}>
              NAME
            </h1>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={classes.rinput}
            ></input>
            <h1 className={classes.rh1}>PHONE</h1>
            <input
              type="tel"
              name="phone"
              pattern="[0-9]{10}"
              className={classes.rinput}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            ></input>
            <h1 className={classes.rh1}>EMAIL</h1>
            <input
              type="email"
              name="email"
              className={classes.rinput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <h1 className={classes.rh1}>PROFILE PIC</h1>
            <input
              type="text"
              name="pic"
              className={classes.rinput}
              value={profileurl}
              onChange={(e) => setProfileUrl(e.target.value)}
            ></input>
            <h1 className={classes.rh1}>USER NAME</h1>
            <input
              type="text"
              name="username"
              className={classes.rinput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
            <h1 className={classes.rh1}>PASSWORD</h1>
            <input
              type="password"
              name="password"
              className={classes.rinput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button className={classes.rbutton} onClick={handleSubmit}>
              Register
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Register;

// array.map(ele, fid => {<Compnent>})
