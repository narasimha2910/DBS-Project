import React, { useEffect, useState } from "react";
import classes from "./Profits.module.css";

const Profits = () => {
  return (
    <div className={classes.outer1}>
      <div>
        <ProfitDaily />
        <ProfitWeekly  />
        <ProfitMonthly />
        <ProfitAllTime  />
      </div>
    </div>
  );
};

export default Profits;

const ProfitAllTime = () => {
  const [profit, setProfit] = useState({});
  useEffect(() => {
    fetch("/v1/api/myProfits", {
      method: "GET",
      headers: {
        authtoken: localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.status === true) {
          setProfit(res);
        }
      });
  }, []);
  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>All time</h2>
      <table className={classes.table1}>
        <thead>
          <tr>
            <td className={classes.td1}>Total Sales</td>
            <td className={classes.td1}>Commision</td>
            <td className={classes.td1}>Total Profit</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={classes.td1}>
              ₹ {Number(profit.total_sales || 0.0).toFixed(2)}
            </td>
            <td className={classes.td1}>
              ₹ {Number(profit.commission || 0.0).toFixed(2)}
            </td>
            <td className={classes.td1}>
              ₹ {Number(profit.profit || 0.0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const ProfitWeekly = () => {
  const [profit, setProfit] = useState({});
  useEffect(() => {
    fetch("/v1/api/myProfitsWeek", {
      method: "GET",
      headers: {
        authtoken: localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.status === true) {
          setProfit(res);
        }
      });
  }, []);
  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>Weekly</h2>
      <table className={classes.table1}>
        <thead>
          <tr>
            <td className={classes.td1}>Total Sales</td>
            <td className={classes.td1}>Commision</td>
            <td className={classes.td1}>Total Profit</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={classes.td1}>
              ₹ {Number(profit.total_sales || 0.0).toFixed(2)}
            </td>
            <td className={classes.td1}>
              ₹ {Number(profit.commission || 0.0).toFixed(2)}
            </td>
            <td className={classes.td1}>
              ₹ {Number(profit.profit || 0.0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const ProfitDaily = () => {
  const [profit, setProfit] = useState({});
  useEffect(() => {
    fetch("/v1/api/myProfitsToday", {
      method: "GET",
      headers: {
        authtoken: localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.status === true) {
          setProfit(res);
        }
      });
  }, []);
  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>Daily</h2>
      <table className={classes.table1}>
        <thead>
          <tr>
            <td className={classes.td1}>Total Sales</td>
            <td className={classes.td1}>Commision</td>
            <td className={classes.td1}>Total Profit</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={classes.td1}>
              ₹ {Number(profit.total_sales || 0.0).toFixed(2)}
            </td>
            <td className={classes.td1}>
              ₹ {Number(profit.commission || 0.0).toFixed(2)}
            </td>
            <td className={classes.td1}>
              ₹ {Number(profit.profit || 0.0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const ProfitMonthly = () => {
  const [profit, setProfit] = useState({});
  useEffect(() => {
    fetch("/v1/api/myProfitsMonth", {
      method: "GET",
      headers: {
        authtoken: localStorage.getItem("token"),
      },
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.status === true) {
          setProfit(res);
        }
      });
  }, []);
  return (
    <div>
      <h2 style={{ marginBottom: 0 }}>Monthly</h2>
      <table className={classes.table1}>
        <thead>
          <tr>
            <td className={classes.td1}>Total Sales</td>
            <td className={classes.td1}>Commision</td>
            <td className={classes.td1}>Total Profit</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={classes.td1}>
              ₹ {Number(profit.total_sales || 0.0).toFixed(2)}
            </td>
            <td className={classes.td1}>
              ₹ {Number(profit.commission || 0.0).toFixed(2)}
            </td>
            <td className={classes.td1}>
              ₹ {Number(profit.profit || 0.0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
