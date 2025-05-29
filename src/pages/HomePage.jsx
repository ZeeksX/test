import React, { useEffect, useState } from "react";
import SidebarWithRoleControl from "../components/SidebarWithRoleControl";
import { AuthProvider, useAuth } from "../components/Auth";
import DynamicTopNav from "../components/topnav/DynamicTopNav";
import { Outlet } from "react-router";
import { AddNewStudentToStudentGroupDialog, CreateExaminationRoom, CreateStudentGroup, JoinStudentGroupDialog, LeaveStudentGroupDialog, ShareStudentGroupLinkDialog } from "../components/courses/CourseComponents";

const HomePage = ({ sidebarOpen, toggleSidebar }) => {
  const [scrolling, setScrolling] = useState(false);
  const user = useAuth();
  const role = user?.user.role || "guest"; // Default to 'guest' if user is not authenticated

  // const handleScroll = () => {
  //   setScrolling(window.scrollY > 0);
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <div className="w-full h-full sm:overflow-hidden">
      <AuthProvider>
        {/* Top navbar for small screens */}
        <DynamicTopNav
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="home-page mt-[64px] flex sm:flex-row flex-col w-full h-[calc(100%_-_64px)]">
          {/* Sidebar for larger screens */}
          <div className="hidden sm:flex w-[264px] border-r-[4px] border-r-border-main">
            <SidebarWithRoleControl role={role} />
          </div>

          {/* Main content container */}
          {!sidebarOpen && (
            <div
              className={`flex-1 h-[calc(100dvh_-_64px)] overflow-auto w-full ${
                scrolling ? "pt-14" : ""
              }`}
            >
              <Outlet />
            </div>
          )}
        </div>

        <CreateExaminationRoom />
        <CreateStudentGroup />
        <JoinStudentGroupDialog />
        <LeaveStudentGroupDialog />
        <ShareStudentGroupLinkDialog />
        <AddNewStudentToStudentGroupDialog />
      </AuthProvider>
    </div>
  );
};

export default HomePage;
