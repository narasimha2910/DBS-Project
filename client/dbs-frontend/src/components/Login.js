import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import classes from "./Login.module.css";
import { Navigate } from "react-router-dom";

const Login = ({ heading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, authenticated, authen } = useContext(AuthContext);

  useEffect(() => { authen() }, [authen])

  const onSubmitHandler = (e) => {
    e.preventDefault();
    login(username, password);
    setUsername("");
    setPassword("");
  };

  return (
    <div>
      {authenticated ? (
        <Navigate to="/index" />
      ) : (
        <>
          {heading && (
            <h1 id={classes.lh2} className={`${classes.lh1}`}>
              {heading}
            </h1>
          )}
          <form className={classes.loginform}>
            <h1 id={classes.ltop} className={`${classes.lh1}`}>
              USER NAME
            </h1>
            <input
              type="text"
              name="username"
              value={username}
              autoComplete="off"
              className={classes.linput}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
            <h1 className={classes.lh1}>PASSWORD</h1>
            <input
              type="password"
              name="password"
              value={password}
              className={classes.linput}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <button className={classes.lbtn} onClick={onSubmitHandler}>
              Login
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
