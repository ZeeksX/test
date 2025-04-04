import { useNavigate } from "react-router";
import { arrow, bannerTransparent } from "../../utils/images.js";

const TopNav = () => {
  const navLinks = ["Home", "Features", "Services", "Contact"];
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };

  return (
    <div className="w-[90vw] mx-auto flex flex-row items-center justify-between h-12 my-4">
      <div className="flex flex-row items-center">
        <img className="w-full h-12" src={bannerTransparent} alt="Acad AI logo" />
      </div>
      <div className="hidden md:flex flex-row w-1/3 items-center justify-between">
        <ul className="flex flex-row w-full md:gap-6 justify-between">
          {navLinks.map((link, index) => (
            <li
              key={index}
              className=" text-[#1836B2] leading-[19px] cursor-pointer font-normal text-sm md:text-base"
            >
              {link}
            </li> // Added key and cursor style
          ))}
        </ul>
      </div>
      <button
        onClick={handleClick}
        className="hidden md:flex flex-row gap-3 hover:ring-2 rounded-[10px] w-[120px] h-[45px] font-normal text-sm md:text-base leading-[19.43px] text-white justify-center items-center bg-[#1836B2]"
      >
        Sign in
        {/* <img src={arrow} alt="arrow" /> */}
      </button>
    </div>
  );
};

export default TopNav;


