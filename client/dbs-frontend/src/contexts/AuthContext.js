import { useState, createContext } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);

  const authen = () => {
    const isAuth = localStorage.getItem("isAuth");
    if (isAuth) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  };

  const login = async (user, pass) => {
    const isAuth = localStorage.getItem("isAuth");
    if (isAuth) {
      setAuthenticated(true);
      return;
    }

    const data = await fetch("/v1/api/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
    });
    const res = await data.json();
    console.log(res);
    if (res.status === true) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("isAuth", true);
      setAuthenticated(true);
    } else {
      alert(res.error);
      //   setAuthenticated(false);
      //   localStorage.setItem("isAuth", false);
    }
  };

  const logout = async () => {
    try {
      const data = await fetch("/v1/api/Logout", {
        method: "GET",
        headers: {
          authtoken: localStorage.getItem("token"),
        },
      });
      const res = await data.json();
      if (res.status === true) {
        localStorage.clear();
        setAuthenticated(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const value = { authenticated, login, logout, authen };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
