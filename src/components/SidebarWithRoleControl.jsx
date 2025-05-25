import { LuLayoutDashboard } from "react-icons/lu";
import { Link, useLocation } from "react-router";
import { CourseDropdownMenu } from "./ui/Dropdown";
import ExaminationDropdown from "./ui/ExaminationDropdown";
import { FiFileText, FiHome, FiUsers } from "react-icons/fi";

const SidebarWithRoleControl = ({ role }) => {
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

  return (
    <div className="fixed w-[260px] h-full flex flex-col items-center justify-start pt-4">
      <div className="space-y-2 w-full">
        {role === "teacher" ? (
          <>
            {adminLinks.map((link, index) => (
              <div
                key={index}
                className="w-full flex flex-col items-center justify-center"
              >
                <button
                  className={`w-full text-left flex items-center transition-colors ${pathname === link.href
                      ? "bg-secondary-bg border-l-4 border-primary-main"
                      : "hover:bg-secondary-bg"
                    }`}
                >
                  <Link to={link.href} className="w-full p-3 flex gap-4">
                    <link.icon size={22} />
                    {link.title}
                  </Link>
                </button>
              </div>
            ))}
            <div className="w-full flex flex-col items-center justify-center">
              <CourseDropdownMenu />
            </div>
          </>
        ) : role === "student" ? (
          <>
            {studentLinks.map((link, index) => (
              <div
                key={index}
                className="w-full flex flex-col items-center justify-center"
              >
                <button
                  className={`w-full text-left flex items-center transition-colors ${pathname === link.href
                      ? "bg-secondary-bg border-l-4 border-primary-main"
                      : "hover:bg-secondary-bg"
                    }`}
                >
                  <Link to={link.href} className="w-full p-3 flex gap-4">
                    <link.icon size={22} />
                    {link.title}
                  </Link>
                </button>
              </div>
            ))}
            {/* Add ExaminationDropdown for students */}
            {/* <div className="w-full flex flex-col items-center justify-center">
              <ExaminationDropdown />
            </div> */}
          </>
        ) : null}
      </div>
      
    </div>
  );
};

export default SidebarWithRoleControl;
