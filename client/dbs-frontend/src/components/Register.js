import classes from "./Register.module.css";

const Register = () => {
  return (
    <div>
      <form autoComplete="off" className={classes.rform}>
        <h1 id={classes.rtop} className={`${classes.rh1}`}>
          NAME
        </h1>
        <input type="text" name="name" className={classes.rinput}></input>
        <h1 className={classes.rh1}>PHONE</h1>
        <input
          type="tel"
          name="phone"
          pattern="[0-9]{10}"
          className={classes.rinput}
        ></input>
        <h1 className={classes.rh1}>EMAIL</h1>
        <input type="email" name="email" className={classes.rinput}></input>
        <h1 className={classes.rh1}>PROFILE PIC</h1>
        <input type="text" name="pic" className={classes.rinput}></input>
        <h1 className={classes.rh1}>USER NAME</h1>
        <input type="text" name="username" className={classes.rinput}></input>
        <h1 className={classes.rh1}>PASSWORD</h1>
        <input
          type="password"
          name="password"
          className={classes.rinput}
        ></input>
        <button className={classes.rbutton}>Register</button>
      </form>
    </div>
  );
};

export default Register;
