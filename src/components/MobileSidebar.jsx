import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { bannerTransparent } from "../utils/images";
import HomeIcon from "@mui/icons-material/Home";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
// import { Fax } from "@mui/icons-material";
import { MdClose } from "react-icons/md";

const MobileSidebar = ({ toggleSidebar, sidebarOpen }) => {
  const [shouldRender, setShouldRender] = useState(sidebarOpen);
  const navItems = [
    { name: "Home", icon: <HomeIcon />, link: "#home" },
    { name: "Our why", icon: <LibraryBooksIcon />, link: "#our-why" },
    { name: "Features", icon: <BeenhereIcon />, link: "#features" },
    { name: "Contact Us", icon: <AccountCircleIcon />, link: "#contact-us" },
  ];

  useEffect(() => {
    if (sidebarOpen) {
      setShouldRender(true);
    } else {
      setTimeout(() => setShouldRender(false), 500);
    }
  }, [sidebarOpen]);

  if (!shouldRender) return null;

  const handleClose = () => {
    toggleSidebar();
  };

  return (
    <>
      <div
        className={`mobile-sidebar !w-full bg-primary-main ${
          sidebarOpen ? "open" : "close"
        }`}
      >
        <div className="flex flex-col gap-12 items-start h-full p-4 relative">
          <button className="absolute top-4 right-4" onClick={() => handleClose()}>
            <MdClose size={36} color="#ffffff" />
          </button>
          {/* <img className="w-full" src={bannerTransparent} alt="Acad AI logo" /> */}
          <div className="flex flex-col items-center justify-between w-full">
            <ul className="flex flex-col gap-16 w-full mt-32">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className="text-white leading-[19px] cursor-pointer font-normal text-[24px] md:text-base w-full flex flex-col justify-center items-center"
                >
                  <a
                    href={item.link}
                    onClick={() => handleClose()}
                    className="w-full flex justify-center items-center gap-2"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="flex flex-col gap-6 items-start w-full">
            <Link to="/login" className="w-4/5">
              <button className="w-full cursor-pointer rounded-lg py-2 px-3 font-medium text-sm text-white bg-[#1836B2] hover:bg-[#0061A2]">
                Login
              </button>
            </Link>
            <Link to="/onboarding" className="w-4/5">
              <button className="w-full cursor-pointer rounded-lg py-2 px-3 font-medium text-sm text-white bg-[#1836B2] hover:bg-[#0061A2]">
                Sign up
              </button>
            </Link>
          </div> */}
        </div>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default MobileSidebar;
