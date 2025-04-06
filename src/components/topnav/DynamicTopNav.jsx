import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { bannerTransparent } from "../../utils/images.js";
import { FiBell, FiSettings } from "react-icons/fi";
import { useAuth } from "../Auth.jsx";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import MobileSidebar from "../lecturer/MobileSidebar.jsx";
import Dropdown from "./Dropdown.jsx";

const DynamicTopNav = () => {
  const [src, setSrc] = useState("");
  const { user } = useAuth();
  const [showDropDown, setShowDropDown] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  const handleClick = () => setShowDropDown((prev) => !prev);

  return (
    <>
      <div
        className={
          "fixed top-0 z-10 w-full flex flex-row items-center justify-between h-16 px-4 border-b-[4px] border-b-border-main bg-white"
        }
      >
        <div className="flex flex-row items-center gap-2">
          <div className="text-2xl cursor-pointer md:hidden flex">
            <DensityMediumIcon onClick={toggleSidebar} />
          </div>
          <img className="w-36 max-[350px]:w-28 lg:w-48" src={bannerTransparent} alt="Acad AI logo" />
        </div>
        <div className="flex items-center justify-start gap-6">
          <FiBell size={20} className="cursor-pointer max-md:hidden" />
          <FiSettings size={20} className="cursor-pointer max-md:hidden" />
          <div
            className="cursor-pointer"
            onClick={() => { handleClick() }}
          >
            <Avatar
            >
              {src ? (
                <AvatarImage src={src} alt="Profile" />
              ) : (
                <AvatarFallback>
                  {user?.last_name ? user?.last_name.charAt(0) : "A"}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
      </div>
      <MobileSidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      <Dropdown showDropDown={showDropDown} setShowDropDown={setShowDropDown}/>
    </>
  );
};

export default DynamicTopNav;
