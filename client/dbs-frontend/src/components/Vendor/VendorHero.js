import React, { useState } from "react";
import VendorContent from "./VendorContent";
import VendorNavBar from "./VendorNavBar";
import VendorSideBar from "./VendorSideBar";

const VendorHero = () => {
  const [active, setActive] = useState(11);
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
        <VendorSideBar setActiveHandler={setActiveHandler} />
        {/* Content in the center */}
        <VendorContent active={active} />
      </div>
      );
    </div>
  );
};

export default VendorHero;
