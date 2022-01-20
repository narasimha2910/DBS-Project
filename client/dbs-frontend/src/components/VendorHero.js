import React, { useState } from "react";
import Content from "./Content";
import VendorNavBar from "./VendorNavBar";
import VendorSideBar from "./VendorSideBar";

const VendorHero = () => {
  const [active, setActive] = useState(1);
  const setActiveHandler = (act) => {
    setActive(act);
    // console.log(active);
  };
  return (
    <div>
      <div>
        {/* NavBar */}
        <VendorNavBar />
        {/* Menu on the left */}
        <VendorSideBar setActiveHandler={setActiveHandler}/>
        {/* Content in the center */}
        <Content active={active}/>
      </div>
      );
    </div>
  );
};

export default VendorHero;
