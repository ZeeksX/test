import React, { useState } from "react";
import { bannerTransparent } from "../../utils/images";
import { Link } from "react-router-dom";
import { FiHome, FiUsers } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { CourseDropdownMenu } from "../ui/Dropdown";
import { CreateExaminationRoom } from "../courses/CourseComponents";

const MobileSidebar = ({ showSidebar, toggleSidebar }) => {
    const sideNavLinks = [
        { icon: FiUsers, title: "Student Group", href: "/student-groups" },
        // { icon: LuLayoutDashboard, title: "Examination Rooms", href: "/rooms" },
    ];
    const { pathname } = useLocation();

    return (
        <>
            <div className={`fixed top-0 left-0 h-screen md:hidden w-64 bg-[#fff] text-black flex-col justify-between transform ${showSidebar ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
                <div className="w-full h-full flex flex-col items-center justify-start pb-8">
                    <div className="space-y-2 w-full flex flex-col items-center justify-center">
                        <img src={bannerTransparent} alt="Acad-AI Logo"
                            className="w-4/5 flex items-center justify-center my-2" />
                        
                        <div className="w-full flex flex-col items-center justify-center">
                            <button
                                className={`w-full text-left flex items-center transition-colors ${pathname === "/dashboard"
                                    ? "bg-secondary-bg border-l-4 border-primary-main"
                                    : "hover:bg-secondary-bg"
                                    }`}
                            >
                                <Link to="/dashboard" className="w-full p-3 flex gap-4" onClick={()=> toggleSidebar()}>
                                    <FiHome size={22} />
                                    Dashboard
                                </Link>
                            </button>
                        </div>
                        <CourseDropdownMenu />
                        {sideNavLinks.map((link, index) => (
                            <div
                                className="w-full flex flex-col items-center justify-center"
                                key={index}
                            >
                                <button
                                    className={`w-full text-left flex items-center transition-colors ${pathname === link.href
                                        ? "bg-secondary-bg border-l-4 border-primary-main"
                                        : "hover:bg-secondary-bg"
                                        }`}
                                >
                                    <Link to={link.href} className="w-full p-3 flex gap-4" onClick={()=> toggleSidebar()}>
                                        <link.icon size={22} />
                                        {link.title}
                                    </Link>
                                </button>
                            </div>
                        ))}
                    </div>

                    <CreateExaminationRoom />
                </div>
            </div>

            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black opacity-50 lg:hidden z-20"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>


    );
};

export default MobileSidebar;
