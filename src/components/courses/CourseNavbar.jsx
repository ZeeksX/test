import React from "react";
import { Topbar, TopbarContent } from "../ui/Navbar";
import { NavLink } from "react-router";

const CourseNavbar = () => {
  const courseLinks = [
    { name: "Published Examinations", href: "published" },
    { name: "Saved Drafts", href: "saved" },
  ];

  return (
    <div className="w-full flex items-center justify-between border-b border-neutral-lightGray z-[5] !h-12 px-4 sticky top-0 left-0">
      <TopbarContent className="h-full">
        {courseLinks.map((courseLink, index) => (
          <NavLink
            to={courseLink.href}
            className={({ isActive }) =>
              `px-2 h-full flex items-center text-sm font-medium justify-center hover:bg-secondary-bg relative ${
                isActive
                  ? "after:w-full after:h-0 after:border-primary-main after:border-t-[.25rem] after:absolute after:left-0 after:bottom-0 after:rounded-t-[.25rem] text-primary-main"
                  : ""
              }`
            }
            key={index}
          >
            {courseLink.name}
          </NavLink>
        ))}
      </TopbarContent>
    </div>
  );
};

export default CourseNavbar;
