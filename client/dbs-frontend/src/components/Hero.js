import Content from "./User/Content";
import Navbar from "./Navbar";
import Sidebar from "./User/Sidebar";
import { useState } from "react";

const Hero = () => {
  const [active, setActive] = useState(1);
  return (
    <div>
      {/* NavBar */}
      <Navbar />
      {/* Menu on the left */}
      <Sidebar setActive={setActive} />
      {/* Content in the center */}
      <Content active={active} />
    </div>
  );
};

export default Hero;
