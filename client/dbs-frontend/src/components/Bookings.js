import classes from "./Bookings.module.css";

const Bookings = () => {
  return (
    <div className={classes.booking}>
      <div className={classes.innerDiv1}>
        <h1 className={classes.bh1}>
          HP PETROL BUNK <span className={classes.bspan}>Rating: 4.5</span>
        </h1>
        <p className={classes.bp1}>New Bel Road, Bangalore</p>
        {/* <p className={classes.bp2}>Rating: 4.5</p> */}
      </div>
      <div className={classes.innerDiv2}>
        <button className={classes.bbutton}>4 wheeler (10)</button>
        <button className={classes.bbutton}>2 wheeler (5)</button>
      </div>
    </div>
  );
};

export default Bookings;
