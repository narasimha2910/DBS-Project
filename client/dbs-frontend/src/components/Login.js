import classes from "./Login.module.css";

const Login = ({heading}) => {
  return (
    <div>
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
          autoComplete="off"
          className={classes.linput}
        ></input>
        <h1 className={classes.lh1}>PASSWORD</h1>
        <input
          type="password"
          name="password"
          className={classes.linput}
        ></input>
        <button className={classes.lbtn}>Login</button>
      </form>
    </div>
  );
};

export default Login;
