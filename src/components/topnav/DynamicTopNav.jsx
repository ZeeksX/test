import React, { useState } from "react";
import logo from "../../assets/brand.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

const DynamicTopNav = () => {
  const [src, setSrc] = useState(""); // The src will be set when the image is gotten from the database, if not the Avatar Fallback will be used

  return (
    <div className="w-full flex flex-row items-center justify-between h-16 px-4 border-b-[4px] border-b-border-main">
      <div className="flex flex-row items-center">
        <img className="w-1/2" src={logo} alt="Acad AI logo" />
      </div>
      <Avatar>
        {src ? (
          <AvatarImage src={src} alt="Profile" />
        ) : (
          <AvatarFallback></AvatarFallback>
        )}
      </Avatar>
    </div>
  );
};

export default DynamicTopNav;
