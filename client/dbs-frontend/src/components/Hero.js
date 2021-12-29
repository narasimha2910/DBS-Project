import Content from "./Content";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Hero = () => {
  return (
    <div>
      {/* NavBar */}
      <Navbar />
      {/* Menu on the left */}
      <Sidebar />
      {/* Content in the center */}
      <Content />
    </div>
  );
};

export default Hero;
