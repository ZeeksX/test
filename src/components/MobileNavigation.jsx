import React, { useEffect } from "react";
import MobileSidebar from "./MobileSidebar";
import { bannerTransparent } from "../utils/images";
import { FiMenu } from "react-icons/fi";

const MobileNavigation = ({ toggleSidebar, sidebarOpen }) => {
  useEffect(() => {
    // Preload the banner image
    const img = new Image();
    img.src = bannerTransparent;
  }, [bannerTransparent]);

  return (
    <>
      <div className="w-[90vw] mx-auto flex flex-row items-center justify-between h-12 my-4">
        <div className="flex flex-row items-center justify-between">
          <img
            className="w-[144.048px] h-12"
            src={bannerTransparent}
            alt="Acad AI logo"
          />
        </div>
        <div onClick={toggleSidebar} className="cursor-pointer">
          <FiMenu size={28} color="#1836B2" />
        </div>
      </div>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed bg-black inset-0 z-10 opacity-50"></div>
      )}

      <MobileSidebar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
    </>
  );
};

export default MobileNavigation;