import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

const DynamicTopNav = () => {
  const [src, setSrc] = useState(""); // The src will be set when the image is gotten from the database, if not the Avatar Fallback will be used

  return (
    <div className="w-full flex flex-row items-center justify-between h-16 px-4 border-b-[4px] border-b-border-main">
      <div className="flex flex-row items-center">
        <img className="w-16" src={logo} alt="Acad AI logo" />
        <div className="flex flex-col">
          <h3 className="flex flex-row text-[#1836B2]  text-lg font-medium">
            ACAD <span className="flex  ml-1 text-[#86C7ED]">AI</span>
          </h3>
          <h3 className="flex flex-row text-[#1836B2] text-[0.5rem] font-medium">
            Artificial Intelligence for Educational good
          </h3>
        </div>
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
