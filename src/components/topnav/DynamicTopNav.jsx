import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { brandLogo } from "../../utils/images.js";
import { FiBell, FiSettings } from "react-icons/fi";
import { useAuth } from "../Auth.jsx";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import MobileSidebar from "../lecturer/MobileSidebar.jsx";

const DynamicTopNav = () => {
  const [src, setSrc] = useState("");
  const { user } = useAuth();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // const handleScroll = () => {
  //   if (window.scrollY > 0) {
  //     setIsScrolled(true);
  //   } else {
  //     setIsScrolled(false);
  //   }
  // };
  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  return (
    <>
      <div className={`fixed z-10 w-full flex flex-row items-center justify-between h-16 px-4 border-b-[4px] border-b-border-main`
        + (isScrolled ? " bg-white" : " bg-transparent")}>
        <div className="flex flex-row items-center gap-2">
          <div className="text-2xl cursor-pointer md:hidden flex">
            <DensityMediumIcon onClick={toggleSidebar} />
          </div>
          <img className="w-1/2" src={brandLogo} alt="Acad AI logo" />
        </div>
        <div className="flex items-center justify-start gap-6">
          <FiBell size={20} className="cursor-pointer" />
          <FiSettings size={20} className="cursor-pointer" />
          <Avatar>
            {src ? (
              <AvatarImage src={src} alt="Profile" />
            ) : (
              <AvatarFallback>
                {user.last_name ? user.last_name.charAt(0) : "A"}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
      <MobileSidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default DynamicTopNav;
