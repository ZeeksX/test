import React from "react";
import { Link, useLocation } from "react-router";
import { FiFileText, FiHome, FiUsers } from "react-icons/fi";
import { CourseDropdownMenu } from "./ui/Dropdown";
import { bannerTransparent } from "../utils/images";

const SidebarWithRoleControl = ({ role, showLogo = false, toggleSidebar = () => { } }) => {

  const { pathname } = useLocation();

  const adminLinks = [
    { icon: FiHome, title: "Dashboard", href: "/dashboard" },
    { icon: FiUsers, title: "Student Groups", href: "/student-groups" },
  ];

  const studentLinks = [
    { icon: FiHome, title: "Dashboard", href: "/dashboard" },
    { icon: FiUsers, title: "Teachers", href: "/lecturers" },
    { icon: FiFileText, title: "Examinations", href: "/examinations" },
  ];

  const links = role === "teacher" ? adminLinks : role === "student" ? studentLinks : [];

  return (
    <div className="w-[264px] h-full flex flex-col items-start bg-white border-r-[4px] border-r-border-main">
      {showLogo && (
        <div className="p-4 w-full flex justify-center">
          <img src={bannerTransparent} alt="Logo" className="w-32" />
        </div>
      )}
      <div className="space-y-2 w-full">
        {links.map((link, index) => (
          <div key={index} className="w-full">
            <button
              className={`w-full text-left flex items-center transition-colors ${pathname === link.href
                ? "bg-secondary-bg border-l-4 border-primary-main"
                : "hover:bg-secondary-bg"
                }`}
            >
              <Link
                to={link.href}
                className="w-full p-3 flex gap-4 items-center"
                onClick={() => {
                  // Only close the sidebar on small screens
                  if (typeof toggleSidebar === "function" && window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
              >
                <link.icon size={22} />
                {link.title}
              </Link>
            </button>
          </div>
        ))}

        {role === "teacher" && (
          <div className="w-full">
            <CourseDropdownMenu />
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarWithRoleControl;
